import React from "react";
import './RGPDText.css';

const RGPDText = () => {
	return (
		<div className="rgpd-container">
			<header className="rgpd-header">
				<h1>Politique de Confidentialité</h1>
			</header>
			<section className="rgpd-section">
				<h2>1. Introduction</h2>
				<p>Notre site, "T-shirt shop", garantit en priorité la confidentialité de vos données personnelles. Cette politique explique la manière dont nous collectons, utilisons et protégeons vos informations conformément au Règlement Général sur la Protection des Données (RGPD).</p>
			</section>
			<section className="rgpd-section">
				<h2>2. Données collectées</h2>
				<ul>
					<li>Données personnelles : Nom, prénom, adresse, numéro de téléphone, adresse e-mail.</li>
					<li>Données de paiement : Informations nécessaires pour traiter les transactions (via un prestataire sécurisé, Paypal, Mastercard, …).</li>
					<li>Données techniques : Adresse IP, cookies, données de localisation,…</li>
					<li>Préférences et interactions : produits consultés, commandes effectuées, clics publicitaires.</li>
				</ul>
			</section>
			<section className="rgpd-section">
				<h2>3. Finalités du traitement</h2>
				<ul>
					<li>Gestion des commandes : traitement, livraison, suivi, facturation.</li>
					<li>Support client : répondre à vos questions et résoudre les litiges.</li>
					<li>Marketing : vous envoyer des offres personnalisées si vous y avez consenti.</li>
					<li>Amélioration de notre site : analyses statistiques pour optimiser votre expérience utilisateur.</li>
					<li>Respect des obligations légales : conservation des factures, prévention de la fraude.</li>
				</ul>
			</section>
			<section className="rgpd-section">
				<h2>4. Base légale</h2>
				<ul>
					<li>Exécution du contrat : pour traiter vos commandes et livrer vos produits.</li>
					<li>Consentement : pour les communications marketing (newsletter, offres spéciales).</li>
					<li>Intérêt légitime : pour l’amélioration de notre site et la personnalisation de l’expérience client.</li>
					<li>Obligations légales : pour respecter la législation en vigueur (notamment fiscale et comptable).</li>
				</ul>
			</section>
			<section className="rgpd-section">
				<h2>5. Partage des données</h2>
				<ul>
					<li>Nos prestataires de vos services logistiques (transporteurs).</li>
					<li>Les plateformes de paiement sécurisé (ex. : Mastercard, PayPal, …).</li>
					<li>Les outils de marketing et d’analyse (ex. : Google Analytics, Meta Ads).</li>
					<li>Les autorités administratives ou judiciaires en cas de nécessité légale.</li>
				</ul>
			</section>
			<section className="rgpd-section">
				<h2>6. Durée de conservation</h2>
				<ul>
					<li>Data liées à votre compte : jusqu’à la fermeture de celui-ci ou après 3 ans d’inactivité.</li>
					<li>Factures et transactions : 10 ans, conformément aux obligations comptables.</li>
					<li>Cookies : durée maximale de 13 mois à compter de votre consentement.</li>
				</ul>
			</section>
			<section className="rgpd-section">
				<h2>7. Vos droits</h2>
				<ul>
					<li>Droit d’accès : obtenir une copie des données personnelles vous concernant.</li>
					<li>Droit de rectification : corriger des données inexactes ou incomplètes.</li>
					<li>Droit à l’effacement : demander la suppression de vos données (sauf obligations légales).</li>
					<li>Droit à la limitation : restreindre le traitement de vos données dans certains cas.</li>
					<li>Droit à la portabilité : recevoir vos données dans un format structuré, lisible par machine.</li>
					<li>Droit d’opposition : vous opposer au traitement de vos données pour des finalités spécifiques (marketing).</li>
				</ul>
				<p>Pour exercer vos droits, contactez-nous à : contact@tshirtShop.com ou par courrier à : 85, Rue de la montagne, 1030 Bruxelles, Belgique. Nous répondrons sous un délai maximal d’un mois.</p>
			</section>
			<section className="rgpd-section">
				<h2>8. Cookies</h2>
				<p>Notre site utilise des cookies pour :</p>
				<ul>
					<li>Assurer le bon fonctionnement du site (cookies essentiels).</li>
					<li>Analyser la navigation pour améliorer nos services (cookies analytiques).</li>
					<li>Vous proposer des publicités ciblées (cookies marketing).</li>
				</ul>
				<p>Vous pouvez gérer vos préférences via notre gestionnaire de cookies ou directement dans les paramètres de votre navigateur.</p>
			</section>
			<section className="rgpd-section">
				<h2>9. Sécurité</h2>
				<p>Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou altération (protocoles de chiffrement, pare-feu et audits réguliers).</p>
			</section>
			<section className="rgpd-section">
				<h2>10. Contact</h2>
				<ul>
					<li>E-mail : contact@tshirtShop.com</li>
					<li>Courrier : 85, Rue de la montagne, 1030 Bruxelles, Belgique</li>
				</ul>
			</section>
			<section className="rgpd-section">
				<h2>11. Modifications de cette politique</h2>
				<p>Nous pouvons mettre à jour cette politique pour refléter les évolutions réglementaires ou technologiques. La version en vigueur est toujours accessible sur cette page.</p>
			</section>
		</div>
	);
};

export default RGPDText;
