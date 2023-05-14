'use client';
import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useAccount } from 'wagmi';
import { Loader } from './Loader';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface UserMenuProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, setOpen }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [signingUp, setSigningUp] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(false);
  const [checkUser, setCheckUser] = useState(true);

  const { address } = useAccount();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  function verifyUser() {
    setCheckUser(true);
    fetch(`${baseUrl}/api/verifyUserHandler?address=${address}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setVerifiedUser(false);
        } else {
          setVerifiedUser(true);
          setUserName(data[0].name);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setCheckUser(false);
      });
  }

  useEffect(() => {
    verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [1]);

  function signUp() {
    setSigningUp(true);
    fetch(`${baseUrl}api/signUpHandler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: userName,
        userEmail: userEmail,
        userWallet: address,
      }),
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((data) => {
        setSigningUp(false);
        setUserName('');
        setUserEmail('');
        verifyUser();
      })
      .catch((error) => console.log('error'));
  }

  return (
    <div
      className={`bg-white border-[1px]  absolute top-15 right-0 p-5 h-screen w-screen ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div
        onClick={() => {
          setOpen(!isOpen);
        }}
        className='border-[1px] rounded-xl cursor-pointer w-fit p-2'
      >
        <AiOutlineClose size={20} />
      </div>
      {checkUser ? (
        <Loader message='Loading...' />
      ) : verifiedUser ? (
        <div>
          <p className='my-5 text-sm'>
            Welcome :{' '}
            <span className='font-semibold text-base'>{userName}</span>
          </p>
          <div className='flex justify-center items-center'>
            <ConnectButton />
          </div>
        </div>
      ) : signingUp ? (
        <Loader message='Signing Up...' />
      ) : (
        // {/* SignUp Form */}
        <div>
          <p className='my-5 text-sm'>
            Complete your signUp by providing following information
          </p>
          <div className='flex justify-center items-center'>
            <div className='rounded-xl max-w-[760px] p-5 border-[1px]'>
              <div className='flex flex-col'>
                <label className='py-1 text-sm uppercase'>Full Name</label>
                <input
                  className='flex rounded-lg border-2 border-gray-300 p-2 text-gray-700'
                  type='text'
                  placeholder='Full Name'
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label className='py-1 text-sm uppercase'>Email</label>
                <input
                  className='flex rounded-lg border-2 border-gray-300 p-2 text-gray-700'
                  type='email'
                  placeholder='Email'
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label className='py-1 text-sm uppercase'>Wallet Address</label>
                <input
                  className='flex rounded-lg border-2 border-gray-300 p-2 text-gray-700'
                  type='email'
                  placeholder={address}
                  disabled
                />
              </div>
              <div className='flex justify-center'>
                <button
                  className='w-fill mt-4 rounded-lg bg-teal-300 p-2 text-center text-gray-700'
                  onClick={signUp}
                >
                  SignUp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
