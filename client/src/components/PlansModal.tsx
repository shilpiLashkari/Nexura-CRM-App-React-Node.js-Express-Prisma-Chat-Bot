import { X, Check } from 'lucide-react';
import axios from 'axios';

interface PlansModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PlansModal = ({ isOpen, onClose }: PlansModalProps) => {
    if (!isOpen) return null;

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (planName: string, priceStr: string) => {
        if (planName === "Starter" || planName === "Enterprise") return; // Demo logic

        const res = await loadRazorpay();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const amount = parseInt(priceStr.replace('$', '')) * 100; // cents

        try {
            // 1. Create Order on Backend
            const orderRes = await axios.post('/api/orders', {
                amount, currency: 'USD'
            });
            const orderData = orderRes.data;

            const options = {
                key: "rzp_test_1234567890", // Mock key for format
                amount: orderData.amount,
                currency: orderData.currency,
                name: "SimpleCRM",
                description: `Upgrade to ${planName}`,
                image: "https://via.placeholder.com/150",
                order_id: orderData.id,
                handler: async function (response: any) {
                    // 2. Verify Payment on Backend
                    await axios.post('/api/verify', {
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature
                    });

                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                    onClose();
                },
                prefill: {
                    name: "Demo User",
                    email: "demo@simplecrm.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#2563EB"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment failed", error);
            alert("Something went wrong initiating payment");
        }
    };

    const plans = [
        {
            name: "Starter",
            price: "$29",
            period: "/month",
            features: ["Up to 1,000 Customers", "Basic Analytics", "5 Team Members", "Email Support"],
            cta: "Current Plan",
            highlight: false
        },
        {
            name: "Professional",
            price: "$99",
            period: "/month",
            features: ["Unlimited Customers", "Advanced Analytics", "Unlimited Team Members", "Priority Support", "Custom Reports"],
            cta: "Upgrade Now",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "$299",
            period: "/month",
            features: ["Everything in Pro", "Dedicated Account Manager", "SSO & Security", "Custom API Access", "SLA Guarantee"],
            cta: "Contact Sales",
            highlight: false
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Your Plan</h2>
                    <p className="text-gray-500 mb-12">Choose the perfect plan for your growing business</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div key={index} className={`relative rounded-2xl p-8 transition-transform hover:-translate-y-1 duration-300 ${plan.highlight ? 'border-2 border-blue-600 shadow-xl' : 'border border-gray-200'}`}>
                                {plan.highlight && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                                <div className="flex items-baseline justify-center mb-8">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500">{plan.period}</span>
                                </div>
                                <ul className="space-y-4 mb-8 text-left">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <Check size={20} className="text-green-500 flex-shrink-0" />
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePayment(plan.name, plan.price)}
                                    className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlansModal;
