/**
 * About Page
 */

const About = () => {
  return (
    <div className="container-custom py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">About KING</h1>

        <div className="space-y-8 prose prose-invert dark:prose-dark">
          <section>
            <h2 className="font-semibold text-2xl mb-4">Our Story</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              KING is a premium fashion e-commerce platform dedicated to bringing you the finest clothing and accessories. We believe in quality, style, and affordability combined into one seamless shopping experience.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-2xl mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To provide an accessible, enjoyable, and reliable platform where customers can discover and purchase high-quality fashion products without the need for account creation. We prioritize convenience and transparency in every transaction.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-2xl mb-4">Why Choose Us?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300"><strong>Guest Checkout:</strong> No account required - shop freely</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300"><strong>Quality Products:</strong> Curated collection of premium items</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300"><strong>Fast Shipping:</strong> Estimated delivery within 7 days</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 dark:text-primary-400 mr-3 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300"><strong>Easy Tracking:</strong> Track your order anytime using your email</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-2xl mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-800">
                <h3 className="font-semibold mb-2">Quality</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Every product is carefully selected to ensure the best value for money
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-800">
                <h3 className="font-semibold mb-2">Customer First</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your satisfaction is our priority - simple, transparent, reliable
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-800">
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We continuously improve our platform for a better experience
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
