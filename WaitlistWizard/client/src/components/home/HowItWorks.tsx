export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Eventique Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple process makes planning your event easier than ever before.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <div className="relative">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto md:mx-0">1</div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600 max-w-xs mx-auto md:mx-0">
                Sign up and specify whether you're looking for services or providing them.
              </p>
            </div>
          </div>
          
          <div className="hidden md:block w-24 h-0.5 bg-gray-300 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
          </div>
          
          <div className="text-center mb-8 md:mb-0">
            <div className="relative">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">2</div>
              <h3 className="text-xl font-semibold mb-2">Browse & Connect</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Find perfect service providers or clients and communicate directly.
              </p>
            </div>
          </div>
          
          <div className="hidden md:block w-24 h-0.5 bg-gray-300 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="relative">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto md:ml-auto">3</div>
              <h3 className="text-xl font-semibold mb-2">Book & Celebrate</h3>
              <p className="text-gray-600 max-w-xs mx-auto md:ml-auto">
                Confirm bookings securely through our platform and enjoy your event.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
