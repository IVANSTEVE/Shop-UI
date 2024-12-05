export default function UserPage({ user }) {
    return (
        <div>
            <h1>Bienvenue, {user.nom} {user.prenom}!</h1>
            <p>Email : {user.email}</p>
        </div>
    );
}
