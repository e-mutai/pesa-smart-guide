
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { RecommendationsProvider, useRecommendations } from '@/contexts/RecommendationsContext';
import AssessmentSection from '@/components/recommendations/AssessmentSection';
import ProfileSummary from '@/components/recommendations/ProfileSummary';
import FundRecommendationsSidebar from '@/components/recommendations/FundRecommendationsSidebar';
import FundDetails from '@/components/recommendations/FundDetails';

const RecommendationsContent = () => {
  const { showResults } = useRecommendations();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Personal Investment Recommendations</h1>
          
          {!showResults ? (
            <AssessmentSection />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Risk Profile Summary */}
              <ProfileSummary />
              
              {/* Fund Recommendations */}
              <div className="lg:col-span-1">
                <FundRecommendationsSidebar />
              </div>
              
              {/* Fund Details */}
              <div className="lg:col-span-2">
                <FundDetails />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const Recommendations = () => {
  return (
    <RecommendationsProvider>
      <RecommendationsContent />
    </RecommendationsProvider>
  );
};

export default Recommendations;
