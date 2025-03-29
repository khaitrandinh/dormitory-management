<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PayOSService
{
    protected $clientId;
    protected $apiKey;
    protected $checksumKey;
    protected $returnUrl;
    protected $webhookUrl;

    public function __construct()
    {
        $this->clientId = env('PAYOS_CLIENT_ID');
        $this->apiKey = env('PAYOS_API_KEY');
        $this->checksumKey = env('PAYOS_CHECKSUM_KEY');
        $this->returnUrl = env('PAYOS_RETURN_URL');
        $this->webhookUrl = env('PAYOS_WEBHOOK_URL');

        // Debug logging
        Log::info('PayOS Credentials Debug', [
            'clientId'    => $this->clientId ? 'Set' : 'Not Set',
            'apiKey'      => $this->apiKey ? substr($this->apiKey, 0, 5) . '...' : 'Not Set',
            'checksumKey' => $this->checksumKey ? substr($this->checksumKey, 0, 5) . '...' : 'Not Set',
            'returnUrl'   => $this->returnUrl,
            'webhookUrl'  => $this->webhookUrl,
        ]);
    }

    // Hàm kiểm tra các giá trị môi trường (nếu cần)
    private function validateCredentials()
    {
        $validator = Validator::make([
            'clientId'    => $this->clientId,
            'apiKey'      => $this->apiKey,
            'checksumKey' => $this->checksumKey,
            'returnUrl'   => $this->returnUrl,
            'webhookUrl'  => $this->webhookUrl,
        ], [
            'clientId'    => 'required',
            'apiKey'      => 'required',
            'checksumKey' => 'required',
            'returnUrl'   => 'required|url',
            'webhookUrl'  => 'required|url',
        ]);

        if ($validator->fails()) {
            Log::error('PayOS Credential Validation Failed', [
                'errors' => $validator->errors()->toArray(),
            ]);
            throw new \Exception('Invalid PayOS configuration');
        }
    }

    /**
     * Tạo chữ ký theo định dạng: 
     * amount=$amount&cancelUrl=$cancelUrl&description=$description&orderCode=$orderCode&returnUrl=$returnUrl
     * và sử dụng HMAC_SHA256 với checksum key.
     *
     * @param array $payload Các trường cần dùng để ký (bao gồm amount, cancelUrl, description, orderCode, returnUrl)
     * @return string
     */
    public function generateSignature(array $payload)
    {
        // Sắp xếp mảng theo key để đảm bảo thứ tự alphabet
        ksort($payload);
        // Xây dựng chuỗi ký theo định dạng yêu cầu, không URL-encode
        // (Chúng ta sử dụng sprintf vì đảm bảo định dạng chính xác)
        $signatureData = sprintf(
            "amount=%s&cancelUrl=%s&description=%s&orderCode=%s&returnUrl=%s",
            $payload['amount'],
            $payload['cancelUrl'],
            $payload['description'],
            $payload['orderCode'],
            $payload['returnUrl']
        );
        Log::info('PayOS Signature Data', ['data' => $signatureData]);

        // Tạo chữ ký với HMAC_SHA256, trả về dạng hex
        $signature = hash_hmac('sha256', $signatureData, $this->checksumKey);
        Log::info('PayOS Signature Generation', [
            'signatureData' => $signatureData,
            'signature'     => $signature,
        ]);
        return $signature;
    }

    /**
     * Tạo link thanh toán bằng API của payOS.
     *
     * @param int $amount Số tiền thanh toán
     * @param int|string $contractId Mã hợp đồng
     * @return array
     */
    public function createPaymentLink($amount, $contractId)
    {
        try {
            $orderCode = time();
            // Nếu tài khoản của bạn có giới hạn description tối đa 9 ký tự, sử dụng chuỗi ngắn (ví dụ: "HopDong2")
            $description = "HopDong" . $contractId;
            $item = [
                "name"     => "Hợp đồng " . $contractId,
                "quantity" => 1,
                "price"    => $amount,
            ];

            // Xây dựng payload theo yêu cầu của API tạo link thanh toán
            $payload = [
                'orderCode'   => $orderCode,
                'amount'      => $amount,
                'description' => $description,
                'items'       => [$item],
                'returnUrl'   => $this->returnUrl,
                'cancelUrl'   => $this->returnUrl, // Nếu có URL hủy riêng, chỉnh lại ở đây
                'webhookUrl'  => $this->webhookUrl,
            ];

            // Tính chữ ký dựa trên 5 trường bắt buộc
            $signaturePayload = [
                'amount'      => $amount,
                'cancelUrl'   => $this->returnUrl,
                'description' => $description,
                'orderCode'   => $orderCode,
                'returnUrl'   => $this->returnUrl,
            ];
            $payload['signature'] = $this->generateSignature($signaturePayload);

            // Gọi API của payOS để tạo link thanh toán
            $response = Http::withOptions(['verify' => false])
                ->withHeaders([
                    'x-client-id' => $this->clientId,
                    'x-api-key'   => $this->apiKey,
                    'Content-Type'=> 'application/json',
                ])
                ->post('https://api-merchant.payos.vn/v2/payment-requests', $payload);

            $responseData = $response->json();

            if ($response->failed() || ($responseData['code'] ?? '') !== '00') {
                Log::error('PayOS API Error', [
                    'status' => $response->status(),
                    'body'   => $responseData,
                ]);
                throw new \Exception('Failed to create PayOS payment link: ' . json_encode($responseData));
            }

            return $responseData;
        } catch (\Exception $e) {
            Log::error('PayOS Service Error', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }
}
