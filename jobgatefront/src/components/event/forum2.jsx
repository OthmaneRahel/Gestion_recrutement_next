import axios from 'axios';
import jsPDF from 'jspdf';
import React, { useMemo,useState, useEffect } from 'react';
import { Link, useActionData, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CalendarIcon, ClockIcon, MapPinIcon, InformationCircleIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const Forum2 = () => {
    const {nom} = useParams()
    const [status, setStatus] = useState('pending'); // 'pending', 'confirmed', 'canceled'
    const [Forums,setForums] = useState([])

 
    const fetchForums = async () => {
        try {
          const res = await axios.get('http://localhost:8000/api/forums_talent/');
          setForums(res.data);
        } catch (error) {
          console.error('Erreur chargement forums', error);
        }
      };

    // pour l'appel des deux fonctions lors de l'execution une seul fois
    useEffect(()=>{
    fetchForums()
    },[])

    // list candidature 
    let [List_cand,setList_cand]=useState([])
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/api/list_cand/').then((res)=>setList_cand(res.data))
    },[])
    
    console.log(List_cand)

  
    let token = localStorage.getItem("token-login")
   
  


    //e un seul objet meme concept de foreach 
    let forum = Forums.find((e) => e.nom == nom )
    console.log("Voici forum:") 
    console.log(forum)

    let list_cand_filtre = List_cand.filter((e)=> e.forum === (forum && forum.id))
    console.log("liste li bghina:",list_cand_filtre)
     


    //fonction de verification 

    let [Info_Inscri,setInfo_Inscri] = useState({
        forum_nom: nom,
        horaire: null
    })



const verification_forum = () => {
    axios.post("http://127.0.0.1:8000/api/InscriptionForum/", Info_Inscri, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(async (e) => {
        console.log("e.data", e.data);
        const doc = new jsPDF();

        // Colors
        const midnightBlue = 'rgb(44, 62, 80)';
        const black = '#000000';
        const lightBlue = 'rgb(1, 136, 223)';
        const green = 'green';
        const red = 'red';
        const yellow = 'yellow';

        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;

        // JobGate logo (top-left)
        const logoSize = 40;
        doc.addImage(process.env.PUBLIC_URL + '/logoJG.png', 'PNG', 0, -9, logoSize, logoSize);


        // === Header ===
        doc.setTextColor(midnightBlue);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("REGISTRATION CONFIRMATION", pageWidth / 2, 30, { align: 'center' });

        doc.setTextColor(lightBlue);
        doc.setFontSize(16);
        doc.text("REGISTRATION SUCCESSFUL", pageWidth / 2, 45, { align: 'center' });

        doc.setTextColor(green);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Your registration has been successfully recorded', pageWidth / 2, 55, { align: 'center' });

        doc.setDrawColor(lightBlue);
        doc.setLineWidth(0.5);
        doc.line(margin, 65, pageWidth - margin, 65);

        // === Participant Information ===
        doc.setTextColor(midnightBlue);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Participant Information', margin, 80);

        doc.setDrawColor(lightBlue);
        doc.setLineWidth(0.2);
        doc.line(margin, 83, margin + 80, 83);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Full Name:', margin, 95);
        doc.setFont('helvetica', 'normal');
        doc.text(`${e.data.data.first_name} ${e.data.data.last_name}`, margin + 35, 95);

        // === Event Details ===
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Event Details', margin, 115);

        doc.setDrawColor(lightBlue);
        doc.line(margin, 118, margin + 85, 118);

        let currentY = 130;

        doc.setFont('helvetica', 'bold');
        doc.text('Name:', margin, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(forum?.nom || 'JobGate Career Forum 2024', margin + 20, currentY);

        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Location: ', margin, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(forum?.lieu , margin + 35 , currentY);

        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Date:', margin, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(forum?.date_forum, margin + 20, currentY);

        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Company:', margin, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(forum?.entreprise, margin + 35, currentY);

        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Time:', margin, currentY);
        doc.setFont('helvetica', 'normal');
        const startDate = forum?.date_debut;
        const endDate = forum?.date_fin;
        doc.text(`${startDate} - ${endDate}`, margin + 25, currentY);

        if (e.data.data.event_horaire != null) {
            currentY += 10;
            doc.setFont('helvetica', 'bold');
            doc.text('Slot:', margin, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(`${e.data.data.event_horaire}`, margin + 25, currentY);
        }

        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Organizer:', margin, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(forum?.organisateur || 'JobGate Events', margin + 35, currentY);

        // === Event Description ===
        currentY += 20;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Event Description', margin, currentY);

        doc.setDrawColor(lightBlue);
        doc.line(margin, currentY + 3, margin + 115, currentY + 3);

        currentY += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const description = forum?.description || 
            "A must-attend event for students and recent graduates seeking professional opportunities, covering technology, finance, marketing, and more. Workshops and lectures will be held by industry experts.";
        const splitDescription = doc.splitTextToSize(description, contentWidth);
        doc.text(splitDescription, margin, currentY);

        // === QR Code ===
        const qrCodeURL = `http://127.0.0.1:8000${forum.qrcode}`;
        const qrCodeSize = 30;
        const qrCodeX = pageWidth - margin - qrCodeSize;
        const qrCodeY = 130;

        try {
            const qrCodeImg = new Image();
            qrCodeImg.crossOrigin = "Anonymous";
            qrCodeImg.src = qrCodeURL;

            await new Promise((resolve, reject) => {
                qrCodeImg.onload = resolve;
                qrCodeImg.onerror = reject;
            });

            doc.addImage(qrCodeImg, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text('Verification Code', qrCodeX + qrCodeSize / 2, qrCodeY + qrCodeSize + 5, { align: 'center' });

        } catch (error) {
            console.error("Error loading QR code:", error);
        }

        // Red instruction at bottom
        const newPhraseY = doc.internal.pageSize.height - 35;
        doc.setTextColor(red);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Please arrive 15 minutes before the event starts', pageWidth / 2, newPhraseY, { align: 'center' });

        // Footer with generation date/time
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const footerY = doc.internal.pageSize.height - 20;
        doc.setTextColor(black);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(`Document generated on ${formattedDate} at ${formattedTime}`, pageWidth / 2, footerY, { align: 'center' });


        // Generate PDF blob and send to backend
        const pdfBlob = doc.output('blob');
        const file = new File([pdfBlob], `Confirmation_${e.data.data.first_name}_${e.data.data.last_name}_${forum?.nom}.pdf`, { type: "application/pdf" });

        const data = new FormData();
        data.append("file", file);
        data.append("forum_nom", forum.nom);

        axios.post("http://127.0.0.1:8000/api/send/", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => console.log(res.data)).catch((e) => console.log(e));

    }).catch((e) => console.log(e));
};


    const [popupShown, setPopupShown] = useState(false);

    //verification l'existance de l'inscription en ce forume
   
     const user = JSON.parse(localStorage.getItem("user"));

    let existe =  list_cand_filtre.some(
        (cand) => cand.email === user.email
     );

    useEffect(() => {

      if (list_cand_filtre && existe) {
        setStatus('confirmed');
        return;
      }
        
        if(!popupShown && Forums.length != 0  && (forum?.duree === 0 || !forum?.duree)) {
            setPopupShown(true);
          
          Swal.fire({
          title: 'Confirmation',
          text: 'Do you want to confirm your registration?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#facc15',
          cancelButtonColor: '#dc2626',
          confirmButtonText: 'Yes, confirm',
          cancelButtonText: 'No, cancel',
          allowOutsideClick: false,
          allowEscapeKey: false
          }).then((result) => {
               if (result.isConfirmed) {
                verification_forum();
                setStatus('confirmed');
                Swal.fire({
                  title: 'Confirmed!',
                  text: 'Your registration has been successfully confirmed.',
                  icon: 'success',
                  confirmButtonColor: 'rgb(1, 136, 223)'
                });
              } else {
                  setStatus('canceled');
              }
          });
      }
      
    }, [forum,popupShown]);

 
    // fonction pour afficher le popup
    const Confirmation = () => {
  if (!popupShown) {
    setPopupShown(true);

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to confirm your registration?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#facc15',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'No, cancel',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        verification_forum();
        setStatus('confirmed');
        Swal.fire({
          title: 'Confirmed!',
          text: 'Your registration has been successfully confirmed.',
          icon: 'success',
          confirmButtonColor: 'rgb(1, 136, 223)'
        });
      } else {
        setStatus('canceled');
      }
    });
  }
};

     
    if (status === 'confirmed') {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-center p-4" style={{ color: 'rgb(44, 62, 80)' }}>
            <svg className="w-24 h-24 mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h1 className="text-4xl font-bold">Registration Confirmed</h1>
            <p className="text-lg mt-2">Thank you for registering. You have received an email with a PDF containing your registration details.</p>
            <Link to="/user" className="mt-8 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ease-in-out" style={{ backgroundColor: 'rgb(1, 136, 223)', boxShadow: '0 4px 14px 0 rgba(1, 136, 223, 0.39)' }}>
                Back to Home
            </Link>
        </div>
    );
}

if (status === 'canceled') {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white text-center p-4" style={{ color: 'rgb(44, 62, 80)' }}>
            <svg className="w-24 h-24 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h1 className="text-4xl font-bold">Registration Canceled</h1>
            <p className="text-lg mt-2">You have canceled the registration process.</p>
            <Link to="/user" className="mt-8 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ease-in-out" style={{ backgroundColor: 'rgb(44, 62, 80)', boxShadow: '0 4px 14px 0 rgba(44, 62, 80, 0.39)' }}>
                Back to Home
            </Link>
        </div>
    );
}


    function generateTimeSlots(start, end, intervalMinutes) {
        let slots = []
        let current = new Date(`${forum && forum.date_forum}T` + start); // convertir en Date
        let endDate = new Date(`${forum && forum.date_forum}T` + end);

        while (current < endDate) {
            let next = new Date(current.getTime() + intervalMinutes * 60000);
            
        
            slots.push(
            current.toTimeString().slice(0, 5) + " - " + next.toTimeString().slice(0, 5)
            );

            current = next;
        }

        return slots;
    }

    let slots = []
    if(forum && forum.duree !== 0){
    slots = generateTimeSlots(forum && forum.date_debut,forum && forum.date_fin,forum && forum.duree)
    console.log("Voici slots", slots)
    }

    


    return (
  // Condition to display this content for forums with slots
  forum && forum.duree && forum.duree !== 0 ? (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            Reserve Time Slots
          </h1>
          <p className="mt-2 text-red font-semibold">
            ⚠️ Booking a slot is mandatory to participate.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Forum Details */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-slate-800">Forum Details</h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Name */}
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-base font-semibold text-slate-800">
                      {forum?.nom || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-start gap-3">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company</p>
                    <p className="mt-1 text-base font-semibold text-slate-800">
                      {forum?.entreprise || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1 text-base text-slate-800">
                      {forum?.date_forum
                        ? new Date(forum.date_forum).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                  <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="mt-1 text-base text-slate-800">
                      {forum?.date_debut && forum?.date_fin
                        ? `${forum.date_debut} - ${forum.date_fin}`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1 text-base text-slate-800">
                      {forum?.lieu || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                  </div>
                </div>
                <p className="mt-10 text-base text-slate-600 break-words">
                  {forum?.description || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Slot List */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-800">Scheduled Slots</h2>
                </div>

                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full mt-2 sm:mt-0">
                  {slots.length * forum.recruteurs.length} slot{slots.length > 1 ? 's' : ''} available
                </span>
              </div>

              <span className="text-sm font-medium text-black bg-yellow-100 px-3 py-1 rounded-full">
                Slot duration: <span className="text-sm font-medium text-yellow bg-yellow-100 px-3 py-1 rounded-full">{forum.duree} min</span>
              </span>

              <div className="p-4">
                <div className="relative">
                  {/* Central line */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 to-indigo-200"></div>

                  {/* Scrollable container */}
                  <div className="max-h-64 overflow-y-auto pr-2 py-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                    <div className="space-y-2">
                      {slots.map((slot, index) => {
                        const count = list_cand_filtre.filter(elem => elem.event_horaire === slot).length;
                        const isFull = forum && count >= forum.recruteurs.length;

                        return (
                          <div key={index} className="relative flex items-start">
                            {/* Timeline dot */}
                            <div className="absolute left-2 -translate-x-1/2 z-10">
                              <div className={`h-3 w-3 rounded-full border-2 ${
                                Info_Inscri.horaire === slot
                                  ? 'border-blue-500 bg-white ring-2 ring-blue-100'
                                  : isFull
                                    ? 'border-gray-300 bg-gray-100'
                                    : 'border-white bg-blue-400 shadow-sm'
                              }`}></div>
                            </div>

                            {/* Slot card */}
                            <div className={`ml-7 flex-1 px-2 py-1 rounded-lg border transition-all duration-200 ${
                              Info_Inscri.horaire === slot
                                ? 'border-blue-400 bg-blue-50 shadow-md ring-1 ring-blue-100'
                                : isFull
                                  ? 'border-gray-200 bg-gray-50'
                                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    value={slot}
                                    onChange={(e) => setInfo_Inscri(prev => ({ ...prev, horaire: e.target.value }))}
                                    name="horaire"
                                    disabled={isFull}
                                    checked={Info_Inscri.horaire === slot}
                                    className="h-3 w-3 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                                  />
                                  <span className={`text-sm font-semibold ${isFull ? 'text-gray-500' : 'text-gray-900'}`}>
                                    {slot}
                                  </span>
                                </div>

                                {isFull ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Full
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {forum ? `${forum.recruteurs.length - count} slot${forum.recruteurs.length - count > 1 ? 's' : ''}` : 'Available'}
                                  </span>
                                )}
                              </div>

                              {Info_Inscri.horaire === slot && (
                                <div className="mt-1 flex items-center text-xs text-blue-600">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Selected slot
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-2 border-t border-gray-100 pt-6">
                  <button
                    type="button"
                    onClick={Confirmation}
                    disabled={!Info_Inscri.horaire}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Confirm Registration
                  </button>

                  {!Info_Inscri.horaire && slots.length > 0 && (
                    <p className="mt-3 text-center text-sm text-red">
                      Please select a slot to confirm your registration
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  ) : null
);

};

export default Forum2;
