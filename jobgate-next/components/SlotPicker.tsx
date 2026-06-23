// // "use client";

// // import { Forum, Candidature } from "@/types";

// // interface SlotPickerProps {
// //   forum: Forum;
// //   slots: string[];
// //   candidatures: Candidature[];
// //   selectedSlot: string | null;
// //   onSelect: (slot: string) => void;
// // }

// // export default function SlotPicker({
// //   forum,
// //   slots,
// //   candidatures,
// //   selectedSlot,
// //   onSelect,
// // }: SlotPickerProps) {
// //   // Nombre de places en parallèle pour un même créneau = nombre de recruteurs présents
// //   const maxParSlot = forum.recruteurs?.length || 1;

// //   if (slots.length === 0) {
// //     return <p className="text-sm text-gray-500">Aucun créneau disponible pour ce forum.</p>;
// //   }

// //   return (
// //     <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
// //       {slots.map((slot) => {
// //         const count = candidatures.filter(
// //           (c) => c.forum === forum.id && c.event_horaire === slot
// //         ).length;
// //         const isFull = count >= maxParSlot;
// //         const isSelected = selectedSlot === slot;
// //         const placesRestantes = maxParSlot - count;

// //         return (
// //           <button
// //             key={slot}
// //             type="button"
// //             disabled={isFull}
// //             onClick={() => onSelect(slot)}
// //             className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
// //               isSelected
// //                 ? "border-primary bg-primary/5 ring-1 ring-primary"
// //                 : isFull
// //                 ? "border-gray-200 bg-gray-50 cursor-not-allowed"
// //                 : "border-gray-200 bg-white hover:border-primary/50 hover:shadow-sm"
// //             }`}
// //           >
// //             <span className={`text-sm font-semibold ${isFull ? "text-gray-400" : "text-gray-800"}`}>
// //               {slot}
// //             </span>

// //             {isFull ? (
// //               <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red/10 text-red">
// //                 Complet
// //               </span>
// //             ) : (
// //               <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green/10 text-green">
// //                 {placesRestantes} place{placesRestantes > 1 ? "s" : ""}
// //               </span>
// //             )}
// //           </button>
// //         );
// //       })}
// //     </div>
// //   );
// // }

// "use client";

// import { Forum, Candidature } from "@/types";
// import { ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

// interface SlotPickerProps {
//   forum: Forum;
//   slots: string[];
//   candidatures: Candidature[];
//   selectedSlot: string | null;
//   onSelect: (slot: string) => void;
//   className?: string;
// }

// export default function SlotPicker({
//   forum,
//   slots,
//   candidatures,
//   selectedSlot,
//   onSelect,
//   className = "",
// }: SlotPickerProps) {
//   const maxParSlot = forum.recruteurs?.length || 1;

//   if (slots.length === 0) {
//     return (
//       <div className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-200 rounded-lg">
//         <ClockIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
//         Aucun créneau disponible pour ce forum.
//       </div>
//     );
//   }

//   return (
//     <div className={`space-y-2 max-h-80 overflow-y-auto pr-1 ${className}`}>
//       {slots.map((slot) => {
//         const count = candidatures.filter(
//           (c) => c.forum === forum.id && c.event_horaire === slot
//         ).length;
//         const isFull = count >= maxParSlot;
//         const isSelected = selectedSlot === slot;
//         const placesRestantes = maxParSlot - count;

//         return (
//           <button
//             key={slot}
//             type="button"
//             disabled={isFull}
//             onClick={() => onSelect(slot)}
//             className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
//               isSelected
//                 ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-1"
//                 : isFull
//                 ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
//                 : "border-gray-200 bg-white hover:border-primary/50 hover:shadow-sm hover:bg-gray-50/50"
//             }`}
//             aria-pressed={isSelected}
//             aria-disabled={isFull}
//           >
//             <div className="flex items-center gap-3">
//               <ClockIcon className={`h-4 w-4 ${
//                 isFull ? "text-gray-400" : isSelected ? "text-primary" : "text-gray-400"
//               }`} />
//               <span className={`text-sm font-medium ${
//                 isFull ? "text-gray-400" : "text-gray-800"
//               }`}>
//                 {slot}
//               </span>
//             </div>

//             {isFull ? (
//               <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red/10 text-red">
//                 <XCircleIcon className="h-3 w-3" />
//                 Complet
//               </span>
//             ) : isSelected ? (
//               <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
//                 <CheckCircleIcon className="h-3 w-3" />
//                 Sélectionné
//               </span>
//             ) : (
//               <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green/10 text-green">
//                 {placesRestantes} place{placesRestantes > 1 ? "s" : ""}
//               </span>
//             )}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

















"use client";

import { Forum, Candidature } from "@/types";
import { ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface SlotPickerProps {
  forum: Forum;
  slots: string[];
  candidatures: Candidature[];
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
  className?: string;
}

export default function SlotPicker({
  forum,
  slots,
  candidatures,
  selectedSlot,
  onSelect,
  className = "",
}: SlotPickerProps) {
  const maxParSlot = forum.recruteurs?.length || 1;

    if (slots.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <ClockIcon className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">No slots available</p>
          <p className="text-xs text-gray-400 mt-1">Slots will be available soon</p>
        </div>
      );
    }
  
    return (
      <div className={`space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar ${className}`}>
        <AnimatePresence>
          {slots.map((slot, index) => {
            const count = candidatures.filter(
              (c) => c.forum === forum.id && c.event_horaire === slot
            ).length;
            const isFull = count >= maxParSlot;
            const isSelected = selectedSlot === slot;
            const placesRestantes = maxParSlot - count;
  
            return (
              <motion.button
                key={slot}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                type="button"
                disabled={isFull}
                onClick={() => onSelect(slot)}
                className={`w-full flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-gradient-to-r from-primary/5 to-purple/5 ring-2 ring-primary/30 shadow-md"
                    : isFull
                    ? "border-gray-100 bg-gray-50/50 cursor-not-allowed opacity-60"
                    : "border-gray-200 bg-white hover:border-primary/40 hover:shadow-md hover:bg-gray-50/50"
                }`}
                aria-pressed={isSelected}
                aria-disabled={isFull}
                whileHover={!isFull && !isSelected ? { scale: 1.01 } : {}}
                whileTap={!isFull ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isFull ? "bg-gray-100" : isSelected ? "bg-primary/10" : "bg-gray-50"
                  }`}>
                    <ClockIcon className={`h-4 w-4 ${
                      isFull ? "text-gray-400" : isSelected ? "text-primary" : "text-gray-400"
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    isFull ? "text-gray-400" : "text-gray-800"
                  }`}>
                    {slot}
                  </span>
                </div>
  
                <div className="flex items-center gap-2">
                  {isFull ? (
                    <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-500">
                      <XCircleIcon className="h-3.5 w-3.5" />
                      Full
                    </span>
                  ) : isSelected ? (
                    <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      Selected
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                      {placesRestantes} spot{placesRestantes > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
  );
}