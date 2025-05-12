
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Pesa Smart</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Using the power of AI to help Kenyans make smarter investment decisions.
            </p>
          </div>
          
          {/* Mission Section */}
          <section className="bg-white rounded-lg shadow-md p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  At Pesa Smart, we believe that every Kenyan deserves access to high-quality investment opportunities and advice. 
                  Our mission is to democratize investment intelligence through technology, making personalized, data-driven 
                  recommendations accessible to all.
                </p>
                <p className="text-gray-600 mb-4">
                  We analyze thousands of data points across money market and unit trust funds in Kenya, considering historical 
                  performance, market trends, risk factors, and economic indicators to provide recommendations that align with 
                  your unique financial goals and risk tolerance.
                </p>
                <Button asChild className="bg-finance-primary hover:bg-finance-secondary">
                  <Link to="/recommendations">Get Your Personalized Recommendation</Link>
                </Button>
              </div>
              <div className="bg-finance-light p-8 rounded-lg">
                <blockquote className="text-lg italic text-finance-primary">
                  "Our aim is to make investing in Kenya more accessible, transparent, and personalized through the 
                  power of artificial intelligence and machine learning."
                </blockquote>
                <p className="text-right mt-4 font-medium">- The Pesa Smart Team</p>
              </div>
            </div>
          </section>
          
          {/* How It Works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">How Pesa Smart Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md relative">
                <span className="absolute -top-4 -left-4 bg-finance-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</span>
                <h3 className="text-xl font-semibold mb-3">Profile Assessment</h3>
                <p className="text-gray-600">
                  Answer questions about your financial situation, goals, and risk tolerance to create your investor profile.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md relative">
                <span className="absolute -top-4 -left-4 bg-finance-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</span>
                <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                <p className="text-gray-600">
                  Our algorithms process market data, fund performance, and economic indicators to match funds to your profile.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md relative">
                <span className="absolute -top-4 -left-4 bg-finance-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</span>
                <h3 className="text-xl font-semibold mb-3">Smart Recommendations</h3>
                <p className="text-gray-600">
                  Receive tailored fund recommendations with performance analytics and projections based on your unique needs.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button asChild className="bg-finance-primary hover:bg-finance-secondary">
                <Link to="/recommendations">Start Your Assessment</Link>
              </Button>
            </div>
          </section>
          
          {/* Why Choose Us */}
          <section className="bg-finance-primary text-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Pesa Smart</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">Data-Driven</h3>
                <p className="text-gray-100">
                  Our recommendations are based on comprehensive data analysis, not sales commissions or promotions.
                </p>
              </div>
              
              <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">Personalized</h3>
                <p className="text-gray-100">
                  Each recommendation is tailored to your unique financial situation, goals, and risk tolerance.
                </p>
              </div>
              
              <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">Transparent</h3>
                <p className="text-gray-100">
                  We clearly explain the reasoning behind each recommendation and show all relevant fund data.
                </p>
              </div>
              
              <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">Independent</h3>
                <p className="text-gray-100">
                  We're not affiliated with any fund managers, ensuring unbiased recommendations for your benefit.
                </p>
              </div>
            </div>
          </section>
          
          {/* FAQs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Is Pesa Smart free to use?</h3>
                  <p className="text-gray-600 mb-4">
                    Yes, our basic fund recommendations and analysis are completely free. We may offer premium features in the future.
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-2">How accurate are the recommendations?</h3>
                  <p className="text-gray-600 mb-4">
                    Our recommendations are based on historical data and market analysis, but all investments carry risk. 
                    Past performance is not indicative of future results.
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-2">Do you sell my financial information?</h3>
                  <p className="text-gray-600 mb-4">
                    No. We respect your privacy and never sell your personal data to third parties. 
                    See our Privacy Policy for more details.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">How often are fund recommendations updated?</h3>
                  <p className="text-gray-600 mb-4">
                    Our database is updated monthly with the latest fund performance data and market trends.
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-2">Can I invest directly through Pesa Smart?</h3>
                  <p className="text-gray-600 mb-4">
                    Currently, we provide recommendations only. You'll need to invest through the respective fund managers 
                    or your broker. We hope to offer direct investing in the future.
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-2">Is Pesa Smart regulated by the CMA?</h3>
                  <p className="text-gray-600 mb-4">
                    Pesa Smart provides information and analysis tools only. We do not provide investment advice 
                    as defined by regulatory bodies. Always consult with a licensed financial advisor before investing.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <section className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Make Smarter Investment Decisions?</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Join thousands of Kenyans who are using Pesa Smart to navigate the complex world of investments.
            </p>
            <Button asChild size="lg" className="bg-finance-primary hover:bg-finance-secondary">
              <Link to="/recommendations" className="inline-flex items-center">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
