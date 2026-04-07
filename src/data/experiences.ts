import expTrilha from "@/assets/exp-trilha.jpg";
import expGastronomia from "@/assets/exp-gastronomia.jpg";
import expHospedagem from "@/assets/exp-hospedagem.jpg";
import expBike from "@/assets/exp-bike.jpg";
import expEcoturismo from "@/assets/exp-ecoturismo.jpg";
import expCamping from "@/assets/exp-camping.jpg";
import expCavalgada from "@/assets/exp-cavalgada.jpg";

export type Category =
  | "Todas"
  | "Hospedagem"
  | "Trilhas"
  | "Gastronomia"
  | "Bike Tour"
  | "Ecoturismo"
  | "Camping"
  | "Cavalgada"
  | "Aventura"
  | "Agroturismo"
  | "Retiro/Bem-estar"
  | "Pesca Esportiva";

export interface Experience {
  id: number;
  image: string;
  title: string;
  location: string;
  category: Category;
  rating: number;
  price: number;
  capacity: number;
  description?: string;
}

export const experiences: Experience[] = [
  {
    id: 1,
    image: expHospedagem,
    title: "Sítio Recanto das Águas",
    location: "Cunha, SP",
    category: "Hospedagem",
    rating: 4.9,
    price: 350,
    capacity: 12,
  },
  {
    id: 2,
    image: expTrilha,
    title: "Trilha da Serra do Mar",
    location: "Petrópolis, RJ",
    category: "Trilhas",
    rating: 4.8,
    price: 89,
    capacity: 15,
  },
  {
    id: 3,
    image: expGastronomia,
    title: "Café Colonial na Fazenda",
    location: "Gramado, RS",
    category: "Gastronomia",
    rating: 4.9,
    price: 120,
    capacity: 20,
  },
  {
    id: 4,
    image: expBike,
    title: "Pedal nas Montanhas",
    location: "Monte Verde, MG",
    category: "Bike Tour",
    rating: 4.7,
    price: 75,
    capacity: 10,
  },
  {
    id: 5,
    image: expEcoturismo,
    title: "Cachoeiras Secretas",
    location: "Chapada dos Veadeiros, GO",
    category: "Ecoturismo",
    rating: 4.9,
    price: 150,
    capacity: 8,
  },
  {
    id: 6,
    image: expCamping,
    title: "Glamping Estrela do Campo",
    location: "São Thomé das Letras, MG",
    category: "Camping",
    rating: 4.6,
    price: 280,
    capacity: 4,
  },
  {
    id: 7,
    image: expCavalgada,
    title: "Cavalgada ao Pôr do Sol",
    location: "Bonito, MS",
    category: "Cavalgada",
    rating: 4.8,
    price: 180,
    capacity: 6,
  },
  {
    id: 8,
    image: expHospedagem,
    title: "Fazenda Boa Vista",
    location: "Visconde de Mauá, RJ",
    category: "Hospedagem",
    rating: 4.7,
    price: 420,
    capacity: 16,
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    title: "Rapel na Serra Gaúcha",
    location: "Cambará do Sul, RS",
    category: "Aventura",
    rating: 4.8,
    price: 160,
    capacity: 8,
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
    title: "Colheita na Fazenda Orgânica",
    location: "Jundiaí, SP",
    category: "Agroturismo",
    rating: 4.7,
    price: 95,
    capacity: 12,
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    title: "Retiro de Yoga na Montanha",
    location: "Alto Paraíso, GO",
    category: "Retiro/Bem-estar",
    rating: 4.9,
    price: 320,
    capacity: 10,
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    title: "Pesca no Rio Araguaia",
    location: "Aruanã, GO",
    category: "Pesca Esportiva",
    rating: 4.6,
    price: 200,
    capacity: 6,
  },
];

export const categories: Category[] = [
  "Todas",
  "Hospedagem",
  "Trilhas",
  "Gastronomia",
  "Bike Tour",
  "Ecoturismo",
  "Camping",
  "Cavalgada",
  "Aventura",
  "Agroturismo",
  "Retiro/Bem-estar",
  "Pesca Esportiva",
];
