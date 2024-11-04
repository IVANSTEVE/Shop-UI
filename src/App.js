import React, { useState } from 'react';
import './App.css';
import useSWR from "swr";

// Fonction asynchrone pour récupérer les données
const fetcher = async (url) => {
    const response = await fetch(url);
    return response.json();
};

function App() {
    const [contentToDisplay, setContentToDisplay] = useState(null); // Par défaut, aucun contenu sélectionné

    return (
        <div>
            <h1>Menu de navigation</h1>
            <nav>
                <ul>
                    <CategoriesList setContentToDisplay={setContentToDisplay} />
                </ul>
            </nav>
            <div>
                {contentToDisplay ? (
                    <CategoryPage category={contentToDisplay} />
                ) : (
                    <HomeScreen />
                )}
            </div>
        </div>
    );
}

function HomeScreen() {
    return <h2>Bienvenue sur la page d'accueil</h2>;
}

// Composant qui affiche la page d'une catégorie spécifique
function CategoryPage({ category }) {
    return <h2>Bienvenue dans la catégorie {category}</h2>;
}


function CategoriesList({ setContentToDisplay }) {
    const { data, error } = useSWR('http://localhost:8080/categories', fetcher);

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

    return (
        <>
            {data.map((category) => (
                <li key={category} onClick={() => setContentToDisplay(category.toLowerCase())}>
                    {category}
                </li>
            ))}
        </>
    );
}

export default App;

