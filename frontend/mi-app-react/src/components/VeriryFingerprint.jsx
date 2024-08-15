

const VerifyFingerprint = ({handleVerifyFinger}) => {

  

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Verificar Huella</h3>
      <button
        onClick={handleVerifyFinger}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Verificar
      </button>
    </div>
  );
};

export default VerifyFingerprint;
