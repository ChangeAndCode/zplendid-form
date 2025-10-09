import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex justify-end mb-4">
      <div className="inline-flex gap-1 text-sm">
        <button
          onClick={() => setLanguage('es')}
          className={`px-2 py-1 transition-colors ${
            language === 'es'
              ? 'text-[#212e5c] font-semibold'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          ES
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 transition-colors ${
            language === 'en'
              ? 'text-[#212e5c] font-semibold'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}

