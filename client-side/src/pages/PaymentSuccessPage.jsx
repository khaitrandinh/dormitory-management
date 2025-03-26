import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PaymentSuccessPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');

  const isSuccess = status === 'PAID';

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow p-4">
        {isSuccess ? (
          <>
            <FaCheckCircle size={80} color="green" className="mb-3" />
            <h2 className="text-success mb-3">Payment Successful!</h2>
            <p className="lead">Thank you for your payment. Your transaction has been processed successfully.</p>
          </>
        ) : (
          <>
            <FaTimesCircle size={80} color="red" className="mb-3" />
            <h2 className="text-danger mb-3">Payment Failed</h2>
            <p className="lead">Unfortunately, your payment was not successful. Please try again or contact support.</p>
          </>
        )}

        <Link to="/" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
