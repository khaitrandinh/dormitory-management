<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class PayOSService
{
    protected $apiUrl = 'https://api-merchant.payos.vn';

    public function createPaymentLink($amount, $contractId)
    {
        $response = Http::withHeaders([
            'x-client-id' => config('payos.client_id'),
            'x-api-key' => config('payos.api_key'),
        ])->withOptions([
            'verify' => base_path('certs/cacert.pem'),
            'timeout' => 30,    
        ])->post("{$this->apiUrl}/v2/payment-requests", [
            'orderCode' => rand(100000, 999999),
            'amount' => $amount,
            'description' => "Payment for contract #$contractId",
            'returnUrl' => config('payos.return_url'),
            'cancelUrl' => config('payos.return_url'),
            'webhookUrl' => config('payos.webhook_url'), 
            'signature' => $this->generateSignature($amount),
        ]);


        if (!$response->successful()) {
            logger()->error('PayOS Error', [
                'response' => $response->body(),
                'request' => [
                    'amount' => $amount,
                    'contract_id' => $contractId,
                ],
            ]);
        }
        

        return $response->json();
    }

    private function generateSignature($amount)
    {
        $key = config('payos.checksum_key');
        return hash_hmac('sha256', $amount, $key);
    }
}
