import React from 'react';
import Header from '@/components/Header';
import Background from '@/components/Background';

const starterTips = [
  {
    id: 1,
    title: '1. Lumière adaptée',
    description: `Place ta plante à un endroit où elle reçoit une bonne quantité de lumière selon ses besoins. Certaines préfèrent la lumière indirecte, d’autres le plein soleil.`,
  },
  {
    id: 2,
    title: '2. Arrosage modéré',
    description: `Arrose quand la terre est sèche en surface (au toucher). Trop d’eau est souvent pire que pas assez : ça peut faire pourrir les racines.`,
  },
  {
    id: 3,
    title: '3. Drainage correct',
    description: `Utilise un pot avec des trous au fond et un terreau bien drainant pour éviter l’eau stagnante.`,
  },
  {
    id: 4,
    title: '4. Température et humidité',
    description: `Garde la plante à une température stable, loin des courants d’air froids ou des sources de chaleur directe. Certaines plantes aiment une atmosphère plus humide.`,
  },
  {
    id: 5,
    title: '5. Entretien régulier',
    description: `Retirer les feuilles mortes ou jaunies, rempote si la plante devient trop à l’étroit, et ajoute un peu d’engrais pendant la saison de croissance (printemps/été).`,
  },
  
  
];


const advancedTips = [
  {
    id: 1,
    title: '1. Connaître le cycle de croissance',
    description: `Renseigne-toi sur la période de croissance active et de repos de ta plante. Cela t’aidera à adapter l’arrosage, la fertilisation et la taille selon les saisons.`,
  },
  {
    id: 2,
    title: "2. Maîtriser l’arrosage selon l’environnement",
    description: `Ajuste la fréquence d’arrosage en fonction de l’humidité ambiante, de la température et de l’exposition. Par exemple, en hiver, la plupart des plantes ont besoin de beaucoup moins d’eau.`,
  },
  {
    id: 3,
    title: '3. Observer les signes de stress',
    description: `Feuilles qui jaunissent, pointes brunes, croissance ralentie ou tâches : chaque symptôme peut indiquer un problème (excès d’eau, manque de lumière, carence…). Apprendre à les repérer et les interpréter est essentiel.`,
  },
  {
    id: 4,
    title: '4. Appliquer l’engrais au bon moment',
    description: `Utilise un engrais adapté (azoté, phosphoré, etc.) pendant la période de croissance, mais jamais en excès. Trop d’engrais peut brûler les racines.`,
  },
  {
    id: 5,
    title: '5. Rempotage réfléchi',
    description: `Rempoter une plante tous les 1 à 2 ans, ou quand les racines sortent par le fond du pot. Choisis un pot légèrement plus grand et adapte le type de substrat selon l’espèce (terreau universel, terre de bruyère, substrat spécial cactées, etc.).`,
  },
  
];


const proTips = [
  {
    id: 1,
    title: '1. Analyser et ajuster le pH du sol',
    description: `Le pH influence directement la capacité d'une plante à absorber les nutriments. Par exemple, les azalées aiment un sol acide, tandis que d’autres préfèrent un pH neutre. Tu peux tester le pH avec un kit ou un pH-mètre, et l’ajuster avec du soufre, de la chaux, ou des amendements organiques.`,
  },
  {
    id: 2,
    title: '2. Maîtriser la lumière en intensité et en durée',
    description: `Utilise un luxmètre pour mesurer précisément la lumière reçue par la plante, et complète avec des lampes horticoles si besoin (spectre ajusté, cycle jour/nuit simulé). Idéal pour les plantes tropicales ou en intérieur sombre.`,
  },
  {
    id: 3,
    title: '3. Surveiller l’humidité relative et créer un microclimat',
    description: `Certaines plantes (comme les calathéas ou fougères) ont besoin d’une humidité constante supérieure à 60 %. Tu peux utiliser un hygromètre et installer des humidificateurs, cloches en verre ou regrouper des plantes pour créer une zone humide localisée.`,
  },
  {
    id: 4,
    title: '4. Prévenir et traiter biologiquement les parasites',
    description: `Apprends à identifier précocement cochenilles, pucerons, thrips ou araignées rouges. Utilise des prédateurs naturels (coccinelles, nématodes), ou des traitements naturels comme le savon noir ou l’huile de neem. Évite les produits chimiques agressifs qui déséquilibrent l’écosystème de la plante.`,
  },
  {
    id: 5,
    title: '5. Adapter les soins à la photopériode et au biorythme',
    description: `Certaines plantes (comme les orchidées ou les poinsettias) nécessitent un cycle lumière/obscurité précis pour fleurir. En respectant leur photopériode naturelle, tu peux favoriser la floraison ou même déclencher une dormance contrôlée selon les besoins.`,
  },
  
];

export default function TipsShowcase() {
  return (

                
    <section id="products" className="min-h-screen bg-[#6fbc29] text-white overflow-hidden">
                  <Background />
                  <Header />
        <h1 className="text-5xl font-light mt-28 ml-12 leading-tight">Tout type de conseils pour être un expert en verdure !</h1>
      <div className="max-w-6xl mx-auto">
        <div>
            <h2 className="text-4xl font-normal mb-2 pt-12">Conseils pour les premières pousses</h2>
          {starterTips.map((starterTips) => (
            <div
              key={starterTips.id}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2"
            >
                
              <div className="p-6">
                <h3 className="text-3xl font-normal mb-2">{starterTips.title}</h3>
                <p className="text-xl font-normal mb-2">{starterTips.description}</p>
              </div>
            </div>
          ))}

          <h2 className="text-4xl font-normal mb-2 pt-12">Conseils pour ceux qui ont la main verte</h2>
          {advancedTips.map((advancedTips) => (
            <div
              key={advancedTips.id}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2"
            >
                
              <div className="p-6 text-right">
                <h3 className="text-3xl font-normal mb-2">{advancedTips.title}</h3>
                <p className="text-xl font-normal mb-2">{advancedTips.description}</p>
              </div>
            </div>
          ))}

        <h2 className="text-4xl font-normal mb-2 pt-12">Conseils pour les rois du jardin</h2>
          {proTips.map((proTips) => (
            <div
              key={proTips.id}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2"
            >
                
              <div className="p-6">
                <h3 className="text-3xl font-normal mb-2">{proTips.title}</h3>
                <p className="text-xl font-normal mb-2">{proTips.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}