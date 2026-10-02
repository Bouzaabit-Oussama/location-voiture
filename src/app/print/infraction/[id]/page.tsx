import { getInfractionById } from "@/app/actions/infractions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/legal/print-button";

export default async function DGSNPrintPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { infraction, error } = await getInfractionById(params.id);

  if (error || !infraction || !infraction.client) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white font-sans text-gray-900">
      
      {/* Floating Print Button for Web View */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-end print:hidden">
        <PrintButton />
      </div>

      {/* A4 Paper Container */}
      <div className="max-w-4xl mx-auto bg-white p-12 shadow-xl print:shadow-none print:p-0" style={{ minHeight: "297mm", width: "210mm" }}>
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold uppercase tracking-wider">Agence Location Voiture</h1>
            <p className="text-sm">RC: _________ | Patente: _________ | IF: _________</p>
            <p className="text-sm">Adresse: _____________________________________</p>
            <p className="text-sm">Tel: _______________ | Email: __________________</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-semibold">ROYAUME DU MAROC</p>
            <p className="text-sm">Ministère de l'Equipement et des Transports</p>
            <p className="text-sm font-bold mt-2">DGSN / NARSA</p>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-xl font-bold uppercase underline mb-2">Déclaration de Conducteur au moment de l'infraction</h2>
          <p className="text-sm italic">(Conformément aux dispositions du Code de la Route Marocain)</p>
        </div>

        {/* BODY */}
        <div className="space-y-8 text-sm leading-relaxed">
          <p>
            Nous, soussignés, <strong>Agence Location Voiture</strong>, déclarons par la présente que le véhicule désigné ci-dessous était loué et sous la responsabilité du client mentionné au moment de l'infraction constatée.
          </p>

          <div className="grid grid-cols-2 gap-8">
            
            {/* CAR INFO */}
            <div className="border border-black p-4">
              <h3 className="font-bold bg-gray-100 border-b border-black -mt-4 -mx-4 p-2 mb-3 uppercase">1. Informations du Véhicule</h3>
              <div className="space-y-2">
                <p><strong>Immatriculation (N° Minéralogique) :</strong> {infraction.vehicle?.plate_number}</p>
                <p><strong>Marque & Modèle :</strong> {infraction.vehicle?.brand} {infraction.vehicle?.model}</p>
                <p><strong>Compagnie d'Assurance :</strong> {infraction.vehicle?.insurance_company || "Non spécifiée"}</p>
              </div>
            </div>

            {/* CLIENT INFO */}
            <div className="border border-black p-4">
              <h3 className="font-bold bg-gray-100 border-b border-black -mt-4 -mx-4 p-2 mb-3 uppercase">2. Conducteur (Locataire)</h3>
              <div className="space-y-2">
                <p><strong>Nom et Prénom :</strong> {infraction.client?.full_name}</p>
                <p><strong>N° CIN / Passeport :</strong> {infraction.client?.identity_card_number}</p>
                <p><strong>N° Permis de Conduire :</strong> {infraction.client?.driving_license_number}</p>
                <p><strong>Adresse déclarée :</strong> {infraction.client?.address}</p>
              </div>
            </div>

          </div>

          {/* INFRACTION INFO */}
          <div className="border border-black p-4">
            <h3 className="font-bold bg-gray-100 border-b border-black -mt-4 -mx-4 p-2 mb-3 uppercase">3. Détails de l'Infraction (NARSA)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Date et Heure :</strong> {format(new Date(infraction.infraction_date), "dd MMMM yyyy à HH:mm", { locale: fr })}</p>
                <p><strong>Type d'infraction :</strong> {
                  infraction.infraction_type === 'speeding' ? "Excès de vitesse" :
                  infraction.infraction_type === 'red_light' ? "Franchissement Feu Rouge" :
                  infraction.infraction_type === 'parking' ? "Stationnement Interdit" :
                  infraction.infraction_type
                }</p>
                <p><strong>Montant réclamé :</strong> {infraction.amount_mad ? `${infraction.amount_mad} MAD` : "Non spécifié"}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Lieu :</strong> {infraction.location}</p>
                <p><strong>Référence Radar :</strong> {infraction.radar_reference || "N/A"}</p>
                <p><strong>Référence Interne (Base) :</strong> #{infraction.id.split('-')[0].toUpperCase()}</p>
              </div>
            </div>
          </div>

          <p className="mt-8">
            En foi de quoi, cette déclaration est délivrée pour servir et valoir ce que de droit auprès des services de police, de la gendarmerie royale, et du Trésorier Payeur.
          </p>

          {/* SIGNATURES */}
          <div className="grid grid-cols-2 mt-16 pt-8 text-center">
            <div>
              <p className="mb-16">Fait à ______________________, le {format(new Date(), "dd/MM/yyyy")}</p>
              <p className="font-bold border-t border-black inline-block pt-2">Cachet et Signature de l'Agence</p>
            </div>
            <div>
              <p className="mb-16">&nbsp;</p>
              <p className="font-bold border-t border-black inline-block pt-2">Signature du Client (si présent)</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
