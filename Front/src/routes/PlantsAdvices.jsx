import React from 'react';

const starterTips = [
  {
    id: 1,
    title: 'Lumière adaptée',
    description: `Place ta plante à un endroit où elle reçoit une bonne quantité de lumière selon ses besoins. Certaines préfèrent la lumière indirecte, d’autres le plein soleil.`,
  },
  {
    id: 2,
    title: 'Arrosage modéré',
    description: `Arrose quand la terre est sèche en surface (au toucher). Trop d’eau est souvent pire que pas assez : ça peut faire pourrir les racines.`,
  },
  {
    id: 3,
    title: 'Drainage correct',
    description: `Utilise un pot avec des trous au fond et un terreau bien drainant pour éviter l’eau stagnante.`,
  },
  {
    id: 4,
    title: 'Température et humidité',
    description: `Garde la plante à une température stable, loin des courants d’air froids ou des sources de chaleur directe. Certaines plantes aiment une atmosphère plus humide.`,
  },
  {
    id: 5,
    title: 'Entretien régulier',
    description: `Retirer les feuilles mortes ou jaunies, rempote si la plante devient trop à l’étroit, et ajoute un peu d’engrais pendant la saison de croissance (printemps/été).`,
  },
  
  
];


const avancedTips = [
  {
    id: 1,
    title: 'Connaître le cycle de croissance',
    description: `Renseigne-toi sur la période de croissance active et de repos de ta plante. Cela t’aidera à adapter l’arrosage, la fertilisation et la taille selon les saisons.`,
  },
  {
    id: 2,
    title: "Maîtriser l’arrosage selon l’environnement",
    description: `Ajuste la fréquence d’arrosage en fonction de l’humidité ambiante, de la température et de l’exposition. Par exemple, en hiver, la plupart des plantes ont besoin de beaucoup moins d’eau.`,
  },
  {
    id: 3,
    title: 'Observer les signes de stress',
    description: `Feuilles qui jaunissent, pointes brunes, croissance ralentie ou tâches : chaque symptôme peut indiquer un problème (excès d’eau, manque de lumière, carence…). Apprendre à les repérer et les interpréter est essentiel.`,
  },
  {
    id: 4,
    title: 'Appliquer l’engrais au bon moment',
    description: `Utilise un engrais adapté (azoté, phosphoré, etc.) pendant la période de croissance, mais jamais en excès. Trop d’engrais peut brûler les racines.`,
  },
  {
    id: 5,
    title: 'Rempotage réfléchi',
    description: `Rempoter une plante tous les 1 à 2 ans, ou quand les racines sortent par le fond du pot. Choisis un pot légèrement plus grand et adapte le type de substrat selon l’espèce (terreau universel, terre de bruyère, substrat spécial cactées, etc.).`,
  },
  
];


const proTips = [
  {
    id: 1,
    title: 'Analyser et ajuster le pH du sol',
    description: `Le pH influence directement la capacité d'une plante à absorber les nutriments. Par exemple, les azalées aiment un sol acide, tandis que d’autres préfèrent un pH neutre. Tu peux tester le pH avec un kit ou un pH-mètre, et l’ajuster avec du soufre, de la chaux, ou des amendements organiques.`,
  },
  {
    id: 2,
    title: 'Maîtriser la lumière en intensité et en durée',
    description: `Utilise un luxmètre pour mesurer précisément la lumière reçue par la plante, et complète avec des lampes horticoles si besoin (spectre ajusté, cycle jour/nuit simulé). Idéal pour les plantes tropicales ou en intérieur sombre.`,
  },
  {
    id: 3,
    title: 'Surveiller l’humidité relative et créer un microclimat',
    description: `Certaines plantes (comme les calathéas ou fougères) ont besoin d’une humidité constante supérieure à 60 %. Tu peux utiliser un hygromètre et installer des humidificateurs, cloches en verre ou regrouper des plantes pour créer une zone humide localisée.`,
  },
  {
    id: 4,
    title: 'Prévenir et traiter biologiquement les parasites',
    description: `Apprends à identifier précocement cochenilles, pucerons, thrips ou araignées rouges. Utilise des prédateurs naturels (coccinelles, nématodes), ou des traitements naturels comme le savon noir ou l’huile de neem. Évite les produits chimiques agressifs qui déséquilibrent l’écosystème de la plante.`,
  },
  {
    id: 5,
    title: 'Adapter les soins à la photopériode et au biorythme',
    description: `Certaines plantes (comme les orchidées ou les poinsettias) nécessitent un cycle lumière/obscurité précis pour fleurir. En respectant leur photopériode naturelle, tu peux favoriser la floraison ou même déclencher une dormance contrôlée selon les besoins.`,
  },
  
];