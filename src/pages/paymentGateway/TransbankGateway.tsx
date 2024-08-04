/* eslint-disable react-refresh/only-export-components */
import { Link, useLoaderData } from 'react-router-dom';
import { webpayCreateOrder } from '../../firebase/service';

interface WebpayData {
    token: string;
    url: string;
}

export async function loader() {
    try {
        const data = await webpayCreateOrder();
        return data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

const Breadcrumb = () => (
    <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
            <li className="breadcrumb-item">
                <Link to="/pasarelas">Pasarelas</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">Webpay</li>
        </ol>
    </nav>
);

const OrderDetails = ({ token, url }: WebpayData) => (
    <>
        <h1>Webpay</h1>
        <ul>
            <li><strong>Producto</strong>: Mesa de computador</li>
            <li><strong>Valor</strong>: $10.000</li>
            <li><strong>Cantidad</strong>: 1</li>
            <li><strong>Orden de compra</strong>: 34324</li>
            <li><strong>TOKEN</strong>: {token}</li>
            <li><strong>URL</strong>: {url}</li>
        </ul>
        <form action={url} method='post' name='form'>
            <input type="hidden" name='token_ws' value={token} />
            <button className='btn btn-danger' type='submit'>
                <i className="fas fa-dollar-sign"></i> Pagar
            </button>
        </form>
    </>
);

const TransbankGateway = () => {
    const data = useLoaderData() as WebpayData;

    return (
        <>
            <Breadcrumb />
            <OrderDetails token={data.token} url={data.url} />
        </>
    )
}

export default TransbankGateway;
