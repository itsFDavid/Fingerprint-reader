const DeleteFingerprint = ({handleDelete}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Eliminar Huella</h3>
      <button
        onClick={handleDelete}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Eliminar
      </button>
    </div>
  );
};

export default DeleteFingerprint;
