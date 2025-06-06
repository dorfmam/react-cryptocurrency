import { useState, useEffect } from "react";
import styles from "./home.module.css";
import { Link } from "react-router-dom";

export interface CoinProps {
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    vwap24Hr: string;
    changePercent24Hr: string;
    rank: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    explore: string;
    formattedPrice?: string;
    formattedMarketCap?: string;
    formattedVolume?: string;
}

interface DataProps {
    data: CoinProps[];
}

export default function Home() {
    const [coins, setCoins] = useState<CoinProps[]>([]);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        getCoins();
    }, [offset]);

    async function getCoins() {
        try {
            const url = `https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=b23962c85b9d77c6b1d81b86dbaf4f100b7b4a396e2b7b1f9d34697ded82d0e5`;
            const response = await fetch(url);
            const data = (await response.json()) as DataProps;

            const priceCompacted = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
                maximumFractionDigits: 3,
            });

            const priceBRLCompacted = Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
                maximumFractionDigits: 3,
            });

            const formattedResult = data.data.map((item) => {
                return {
                    ...item,
                    formattedPrice: priceCompacted.format(
                        Number(item.priceUsd)
                    ),
                    formattedMarketCap: priceBRLCompacted.format(
                        Number(item.marketCapUsd)
                    ),
                    formattedVolume: priceCompacted.format(
                        Number(item.volumeUsd24Hr)
                    ),
                };
            });

            const listCoins = [...coins, ...formattedResult];

            setCoins(listCoins);
            console.log(formattedResult);
        } catch (error) {
            console.error("Erro ao buscar as moedas:", error);
        }
    }

    function handleLoadMore() {
        if (offset === 0) {
            setOffset(10);
            return;
        }

        setOffset(offset + 10);
    }

    return (
        <div>
            <main className={styles.container}>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Moeda</th>
                            <th scope="col">Valor de Mercado</th>
                            <th scope="col">Preço</th>
                            <th scope="col">Volume</th>
                            <th scope="col">Mudança em 24 horas</th>
                        </tr>
                    </thead>

                    <tbody id="tbody">
                        {coins.length > 0 &&
                            coins.map((item) => (
                                <tr className={styles.tr}>
                                    <td
                                        className={styles.tdLabel}
                                        data-label="Moeda"
                                    >
                                        <div className={styles.name}>
                                            <img
                                                alt="Coin Logo"
                                                className={styles.logo}
                                                src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                                            />
                                            <Link to={"/"}>
                                                <span>{item.name}</span> |{" "}
                                                {item.symbol}
                                            </Link>
                                        </div>
                                    </td>

                                    <td
                                        className={styles.tdLabel}
                                        data-label="Valor de Mercado"
                                    >
                                        {item.formattedMarketCap}
                                    </td>

                                    <td
                                        className={styles.tdLabel}
                                        data-label="Preço"
                                    >
                                        {item.formattedPrice}
                                    </td>

                                    <td
                                        className={styles.tdLabel}
                                        data-label="Volume"
                                    >
                                        {item.formattedVolume}
                                    </td>

                                    <td
                                        className={
                                            Number(item.changePercent24Hr) > 0
                                                ? styles.tdProfit
                                                : styles.tdLoss
                                        }
                                        data-label="Mudança em 24 horas:"
                                    >
                                        <span>
                                            {Number(
                                                item.changePercent24Hr
                                            ).toFixed(3)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <button className={styles.buttonMore} onClick={handleLoadMore}>
                    Carregar Mais Moedas
                </button>
            </main>
        </div>
    );
}
