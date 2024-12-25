import { MDBContainer, MDBCol, MDBRow } from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import Disclogo from '../Assets/Disc-logo.png';
import Lininglogo from '../Assets/Lining-logo.png';
import { baseURLclient } from '../Ultility/ApiSetup/api';

const HomepageTwin = () => {
    const imageStyle = {
        width: '200px', // Set a consistent width
        height: '200px', // Set a consistent height
        objectFit: 'contain', // Maintain aspect ratio without distortion
    };

    return (
        <MDBContainer fluid className="p-3 my-5 h-custom">
            <MDBRow className="d-flex justify-content-center align-items-center h-100">

                {/* Disc Brake Section */}
                <MDBCol
                    col="12"
                    md="6"
                    className="d-flex flex-column align-items-center text-center"
                    onClick={() => window.location.href = `${baseURLclient}/login`}
                    style={{ cursor: 'pointer' }} // Add cursor pointer for better UX
                >
                    <div className="text-center mt-4">
                        <h5>ระบบจัดการข้อมูลผลิตภัณฑ์ดิสเบรกสำหรับการผลิต</h5>
                    </div>
                    <div className="d-flex justify-content-center w-100">
                        <img
                            src={Disclogo}
                            style={imageStyle} // Apply consistent size
                            alt="Disc Brake Illustration"
                        />
                    </div>
                </MDBCol>

                {/* Brake Lining Section */}
                <MDBCol
                    col="12"
                    md="6"
                    className="d-flex flex-column align-items-center text-center"
                    onClick={() => window.location.href = `${baseURLclient}/brake-lining`}
                    style={{ cursor: 'pointer' }} // Add cursor pointer for better UX
                >
                    <div className="text-center mt-4">
                        <h5>ระบบจัดการข้อมูลผลิตภัณฑ์ผ้าเบรกสำหรับการผลิต</h5>
                    </div>
                    <div className="d-flex justify-content-center w-100">
                        <img
                            src={Lininglogo}
                            style={imageStyle} // Apply consistent size
                            alt="Brake Lining Illustration"
                        />
                    </div>
                </MDBCol>

            </MDBRow>
        </MDBContainer>
    );
};

export default HomepageTwin;
