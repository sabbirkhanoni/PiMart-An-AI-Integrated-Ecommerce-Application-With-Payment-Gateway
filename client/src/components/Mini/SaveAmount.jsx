import { useState } from 'react';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { DisplayPriceInBDT } from '../../utils/DisplayPriceInBDT';
import { Sparkles, X } from 'lucide-react';

const SaveAmount = () => {
  const { savedAmount } = useGlobalContext();
  const [dismissed, setDismissed] = useState(false);

  if (!savedAmount || savedAmount <= 0 || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:block animate-slideInRight">
      <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-gray-900 font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-200/80 backdrop-blur-xs">
        <div className="w-8 h-8 rounded-full bg-white/90 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles size={16} className="fill-amber-500 text-amber-500" />
        </div>
        <div className="pr-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-950/80">
            Total Savings
          </div>
          <div className="text-sm font-black text-white drop-shadow-xs">
            {DisplayPriceInBDT(savedAmount)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-amber-950/70 hover:text-white p-1 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
          title="Dismiss"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

export default SaveAmount;
