import { Package } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Package className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800">ELIFTECH</span>
          </div>
          <div className="text-center text-sm text-gray-600">
            <div>+1 302 543 20 12 | info@eliftech.com</div>
            <div className="text-blue-600 mt-1">www.eliftech.com</div>
          </div>
          <div className="text-xs text-gray-500">
            © 2024 ELIFTECH. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;