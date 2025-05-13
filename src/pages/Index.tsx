
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-finance-primary to-finance-secondary text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Smart Investment Decisions with AI-Powered Recommendations
                </h1>
                <p className="text-lg opacity-90 mb-8">
                  Pesa Smart uses machine learning to help you find the best-performing money market 
                  and unit trust funds in Kenya, tailored to your financial goals and risk profile.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-white text-finance-primary hover:bg-gray-100">
                    <Link to="/recommendations">Get My Recommendations</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-finance-primary font-medium border-2">
                    <Link to="/funds">Explore Funds</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl w-full max-w-md">
                  <h3 className="font-semibold text-xl mb-4">Featured Funds Performance</h3>
                  
                  {/* Mock Fund Performance Items */}
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">CIC Money Market</div>
                        <div className="text-sm opacity-80">Low Risk</div>
                      </div>
                      <div className="text-green-300 font-bold">+9.8%</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">Britam Equity Fund</div>
                        <div className="text-sm opacity-80">High Risk</div>
                      </div>
                      <div className="text-green-300 font-bold">+14.2%</div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">ICEA Balanced Fund</div>
                        <div className="text-sm opacity-80">Medium Risk</div>
                      </div>
                      <div className="text-green-300 font-bold">+11.5%</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button asChild variant="link" className="text-white">
                      <Link to="/funds" className="flex items-center">
                        View All Funds <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How Pesa Smart Works For You</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform analyzes thousands of data points to provide personalized investment recommendations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="bg-finance-light p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-finance-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Risk Assessment</h3>
                <p className="text-gray-600">
                  Answer a few questions about your financial goals, time horizon, and comfort with risk to get your personalized risk profile.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="bg-finance-light p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-finance-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                <p className="text-gray-600">
                  Our machine learning algorithms analyze fund performance, market trends, and economic indicators to match funds to your profile.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="bg-finance-light p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-finance-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalized Recommendations</h3>
                <p className="text-gray-600">
                  Receive tailored investment recommendations with detailed performance metrics and projected returns.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-finance-primary hover:bg-finance-secondary text-white">
                <Link to="/recommendations">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to make smarter investment decisions?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of Kenyans who use Pesa Smart to navigate investment options and grow their wealth.
            </p>
            <Button asChild size="lg" className="bg-finance-primary hover:bg-finance-secondary text-white">
              <Link to="/recommendations">Get My Fund Recommendations</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
