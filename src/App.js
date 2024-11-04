import React, { useState } from 'react';
import './App.css';
// SWR est une bibliothèque qui facilite la récupération des données depuis API.
import useSWR from "swr";

// `fetcher` est une fonction asynchrone qui effectue une requête `fetch` vers l'URL donnée
// et renvoie les données sous forme de JSON.
const fetcher = async (url) => {
    const response = await fetch(url);
    return response.json();
};

function App() {
    // Utilisation d'un état React pour gérer l'affichage conditionnel.
    // contentToDisplay représente la catégorie actuellement sélectionnée.
    // setContentToDisplay est une fonction pour mettre à jour cet état.
    // useState(null) indique qu'aucune catégorie n'est sélectionnée par défaut.
    const [contentToDisplay, setContentToDisplay] = useState(null);

    return (
        <div>
            <h1>Menu de navigation</h1>
            <nav>
                <ul>
                    {/* Appel du composant CategoriesList, qui reçoit setContentToDisplay
                    en prop pour pouvoir modifier le contenu à afficher en fonction de la catégorie sélectionnée */}
                    <CategoriesList setContentToDisplay={setContentToDisplay} />
                </ul>
            </nav>
            <div>
                {/* Si contentToDisplay est null, alors HomeScreen s'affiche.
                Sinon, CategoryPage s'affiche avec les produits de la catégorie sélectionnée */}
                {contentToDisplay ? (
                    <CategoryPage category={contentToDisplay} />
                ) : (
                    <HomeScreen />
                )}
            </div>
        </div>
    );
}

// Composant qui affiche le contenu de la page d'accueil
function HomeScreen() {
    return <h2>Bienvenue sur la page d'accueil</h2>;
}

// Composant qui récupère la liste des catégories depuis l'API et les affiche sous forme de liste cliquable
function CategoriesList({ setContentToDisplay }) {
    // Utilisation de SWR pour récupérer les données de l'API. `data` contient les catégories,
    // et `error` indique s'il y a eu un problème de chargement.
    const { data, error } = useSWR('http://localhost:8080/categories', fetcher);

    // Gestion des erreurs de chargement et de l'état de chargement
    if (error) return <div>Échec du chargement des catégories</div>;
    if (!data) return <div>Chargement des catégories...</div>;

    return (
        <>
            {/* `data` (les catégories récupérées par SWR) est parcouru avec `map` pour créer
            un élément <li> pour chaque catégorie. Chaque catégorie est accessible via la variable `category`. */}
            {data.map((category) => (
                // Chaque <li> représente une catégorie cliquable.
                // Lorsque l'utilisateur clique sur une catégorie, on utilise onClick pour
                // définir contentToDisplay avec le nom de la catégorie en minuscule
                //c'est un moyen de remonter l'information our la transmettre ensuite a CategoryPage
                //puisqu'elle prend contentToDisplay en prop
                <li key={category} onClick={() => setContentToDisplay(category.toLowerCase())}>
                    {/* Affiche le nom de la catégorie */}
                    {category}
                </li>
            ))}
        </>
    );
}

// Composant qui affiche la liste des produits d'une catégorie donnée
// Il reçoit `category`, qui est l'état actuel défini par `setContentToDisplay`
function CategoryPage({ category }) {
    // Utilisation de SWR pour récupérer la liste des produits de la catégorie sélectionnée
    const { data, error } = useSWR(`http://localhost:8080/products/categories/${category}`, fetcher);

    // Gestion des erreurs et de l'état de chargement
    if (error) return <div>Échec du chargement des produits</div>;
    if (!data) return <div>Chargement des produits...</div>;

    return (
        <div>
            <h2>Produits dans la catégorie {category}</h2>
            <ul>
                {/* Affiche chaque produit de la catégorie sous forme d'un <li>,
                en utilisant uniquement le nom du produit pour le moment */}
                {data.map((product) => (
                    <li key={product.idProduct}>{product.productName}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;


