import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = () => {
  const navigate = useNavigate();

  // Function to convert UUID string to a 16-byte Uint8Array
  function uuidToBytes(uuid) {
    return new Uint8Array(uuid.replace(/-/g, '').match(/.{2}/g).map(byte => parseInt(byte, 16)));
  }

  // Function to Base64 encode the bytes (without padding)
  function toBase64URL(bytes) {
    return btoa(String.fromCharCode(...bytes)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  const createListId = () => {
    return toBase64URL(uuidToBytes(crypto.randomUUID()));
  };

  useEffect(() => {
    navigate(`/list/${createListId()}`, { replace: true });
  }, [navigate]);

  return null;
}
  
export default Redirect