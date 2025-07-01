// import React from "react";
// import { motion } from "framer-motion";
// import {
//   Brush,
//   Clock,
//   Eye,
//   Facebook,
//   Mail,
//   MapPin,
//   Phone,
//   Scissors,
//   Sparkles,
//   Twitter,
// } from "lucide-react";
// import { Instagram } from "lucide-react";

// const services = [
//   {
//     icon: Sparkles,
//     name: "SPA",
//     description: "Détendez-vous avec nos soins corporels luxueux",
//     prestations: ["Massage relaxant", "Gommage corporel", "Enveloppement ..."],
//     image: "/spa.jpeg",
//   },
//   {
//     icon: Brush,
//     name: "Pédicure et manucure",
//     description: "Sublimez vos mains et vos pieds",
//     prestations: [
//       "Manucure classique",
//       "Pédicure spa",
//       "Pose de vernis semi-permanent ...",
//     ],
//     image: "/manicure.jpg",
//   },
//   {
//     icon: Scissors,
//     name: "Coiffure",
//     description: "Transformez votre look avec nos experts coiffeurs",
//     prestations: ["Coupe", "Coloration", "Brushing ..."],
//     image: "/coiffure.jpg",
//   },
//   {
//     icon: Eye,
//     name: "Extensions de cils",
//     description: "Obtenez un regard envoûtant",
//     prestations: ["Pose complète", "Remplissage", "Dépose ..."],
//     image: "/cil.jpg",
//   },
// ];
// const Footer = () => {
//   function scrollToSection(arg0: string): void {
//     throw new Error("Function not implemented.");
//   }

//   return (
//     <footer id="contact" className="bg-white py-16">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//           >
//             <h3 className="text-2xl font-bold mb-6 text-[#ab934f]">
//               AUTOSPA SN
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Préservez la beauté et la valeur de votre véhicule.
//             </p>
//             <div className="flex space-x-4">
//               <motion.a
//                 href="#"
//                 className="text-[#ab934f] hover:text-[#445057] transition-colors duration-300"
//                 whileHover={{ scale: 1.2 }}
//               >
//                 <Instagram className="w-6 h-6" />
//               </motion.a>
//               <motion.a
//                 href="#"
//                 className="text-[#ab934f] hover:text-[#445057] transition-colors duration-300"
//                 whileHover={{ scale: 1.2 }}
//               >
//                 <Facebook className="w-6 h-6" />
//               </motion.a>
//               <motion.a
//                 href="#"
//                 className="text-[#ab934f] hover:text-[#445057] transition-colors duration-300"
//                 whileHover={{ scale: 1.2 }}
//               >
//                 <Twitter className="w-6 h-6" />
//               </motion.a>
//             </div>
//           </motion.div>
//           <div>
//             <h3 className="text-xl font-semibold mb-6 text-[#ab934f]">
//               Nos Services
//             </h3>
//             <ul className="space-y-2">
//               {services.map((service, index) => (
//                 <motion.li
//                   key={index}
//                   whileHover={{ x: 10 }}
//                   transition={{ type: "spring", stiffness: 400 }}
//                 >
//                   <button
//                     onClick={() => scrollToSection("services")}
//                     className="text-gray-600 hover:text-[#ab934f] transition-colors duration-300"
//                   >
//                     {service.name}
//                   </button>
//                 </motion.li>
//               ))}
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold mb-6 text-[#ab934f]">
//               Nos Salons
//             </h3>
//             <div className="space-y-4">
//               <motion.div
//                 className="flex items-start"
//                 whileHover={{ x: 10 }}
//                 transition={{ type: "spring", stiffness: 400 }}
//               >
//                 <MapPin className="w-5 h-5 text-[#ab934f] mr-2 mt-1 flex-shrink-0" />
//                 <div>
//                   <h4 className="font-semibold text-gray-800">Almadies</h4>
//                   <p className="text-gray-600">Corniche des Almadies</p>
//                 </div>
//               </motion.div>
//               <motion.div
//                 className="flex items-start"
//                 whileHover={{ x: 10 }}
//                 transition={{ type: "spring", stiffness: 400 }}
//               >
//                 <MapPin className="w-5 h-5 text-[#ab934f] mr-2 mt-1 flex-shrink-0" />
//                 <div>
//                   <h4 className="font-semibold text-gray-800">Sea Plaza</h4>
//                   <p className="text-gray-600">Centre commercial Sea Plaza</p>
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold mb-6 text-[#ab934f]">
//               Contact
//             </h3>
//             <ul className="space-y-4">
//               <motion.li
//                 className="flex items-center"
//                 whileHover={{ x: 10 }}
//                 transition={{ type: "spring", stiffness: 400 }}
//               >
//                 <Phone className="w-5 h-5 text-[#ab934f] mr-2" />
//                 <span className="text-gray-600">+221 78 120 86 86</span>
//               </motion.li>
//               <motion.li
//                 className="flex items-center"
//                 whileHover={{ x: 10 }}
//                 transition={{ type: "spring", stiffness: 400 }}
//               >
//                 <Mail className="w-5 h-5 text-[#ab934f] mr-2" />
//                 <a
//                   href="mailto:contact@beautyandco.com"
//                   className="text-gray-600 hover:text-[#ab934f] transition-colors duration-300"
//                 >
//                   beautyandcoldn@gmail.com
//                 </a>
//               </motion.li>
//               <motion.li
//                 className="flex items-center"
//                 whileHover={{ x: 10 }}
//                 transition={{ type: "spring", stiffness: 400 }}
//               >
//                 <Clock className="w-5 h-5 text-[#ab934f] mr-2" />
//                 <span className="text-gray-600">Lun - Dim : 10h - 20h</span>
//               </motion.li>
//             </ul>
//           </div>
//         </div>
//         <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
//           <p>&copy; 2023 BeautyAndCo. Tous droits réservés.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
