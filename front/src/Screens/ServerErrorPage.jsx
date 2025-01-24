import { useNavigate } from 'react-router-dom'

const ServerErrorPage = () => {
    const navigate = useNavigate()
    const handleClick=() => {
        navigate('/')
    }
    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center">
            <div className="row my-5">
                <div className="col d-flex align-items-center justify-content-center flex-wrap">
                    <div className="col-lg-4 col-md-12 text-lg-end">
                        <img
                            src="/triste.png"
                            className="w-ft-10 w-ft-md-25 w-ft-lg-50" 
                            alt="Server Error"
                        />
                    </div>

                    <div className="col-lg-6 col-md-12 ErrorPageDiv">
                        <h4>No se ha podido conectar con el servidor</h4>
                    </div>
                    <div className="col-12 my-4">
                        <button type="button" className="btn btn-outline-light" onClick={handleClick}>Reintentar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServerErrorPage;
