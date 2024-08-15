import  { useState } from 'react';
import VeriryFingerprint from './VeriryFingerprint';
import EnrrolFingerprint from './EnrrolFingerprint';
import DeleteFingerprint from './DeleteFingerprint';
import { Aside } from './Aside';
import { readFingerprint, enrollFingerprint, deleteFingerprint} from '../services/api';
import { Result } from './Result';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'




const FingerprintActions = () => {
  const [fingerprintId, setFingerprintId] = useState(null);
  const [result, setResult] = useState('');
  const MySwal = withReactContent(Swal)
  const handleFingerprintId = (e) => {
    const id = parseInt(e.target.value);
    setFingerprintId(id);
  }
  const handleVerifyFinger = async () => {
    MySwal.fire({
      position: "center",
      icon: "info",
      title: "Coloque su dedo en el sensor",
      showConfirmButton: false,
      timer: 1500
    });
    try {
      const data = await readFingerprint();
      setResult(JSON.stringify(data, null, 2));
      if(data.status!== 'success'){
        MySwal.fire({
          position: "center",
          icon: "error",
          title: "Error al verificar huella",
          showConfirmButton: false,
          timer: 1500
        });
      }else{
        MySwal.fire({
          position: "center",
          icon: "success",
          title: "Huella verificada",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      MySwal.fire({
        position: "center",
        icon: "error",
        title: "Error al verificar huella",
        showConfirmButton: false,
        timer: 1500
      });
      setResult('Error al verificar huella: ');
    }
  };
  const handleEnroll = async () => {
    try {
      const data = await enrollFingerprint(fingerprintId);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error al enrolar huella: ' + error.message);
    }
  };
  const handleDelete = async () => {
    try {
      const data = await deleteFingerprint(fingerprintId);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error al eliminar huella: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex">
      <Aside name="Fingerprint Actions" />
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-semibold">Fingerprint Actions</h2>
        <div className="mt-6">
          <input
            type="number"
            value={fingerprintId}
            onChange={(e) => handleFingerprintId(e)}
            placeholder="Enter fingerprint ID"
            className="border border-gray-300 p-2 rounded"
          />
          <div className="mt-3 flex gap-x-4 ">
            <VeriryFingerprint  handleVerifyFinger={handleVerifyFinger}/>
            <EnrrolFingerprint  handleEnroll={handleEnroll}/>
            <DeleteFingerprint  handleDelete={handleDelete}/>
          </div>
          {result && <Result result={result} />}
        </div>
      </main>
    </div>
  );
}

export default FingerprintActions;
