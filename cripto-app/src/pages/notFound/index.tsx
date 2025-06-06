import { Link } from "react-router-dom";
import styles from "./notFound.module.css";

export default function NotFound() {
    return (
        <div>
            <h1 className={styles.paragraph}>
                Erro 404 - Página Não Localizada
            </h1>
            <br />
            <br />
            <Link to={"/"}>Clique aqui para voltar para a página inicial</Link>
        </div>
    );
}
