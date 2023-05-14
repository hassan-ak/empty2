'use client';

import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import avatar from '../../../public/images/placeholder.jpg';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { UserMenu } from './UserMenu';
import { BiLoaderCircle } from 'react-icons/bi';
export const Navbar = () => {
  const { isConnecting, isConnected, isDisconnected } = useAccount();

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(false)
  }, [isDisconnected])
  
  
  return (
    <div className='bg-neutral-100 border-[1px]  fixed w-full'>
      <div className='flex justify-end px-5 py-3'>
        {!isConnected ? (
          isConnecting ? (
            <div className='border-[1px] flex bg-white px-3 py-1 rounded-xl'>
              <BiLoaderCircle size={30} />
            </div>
          ) : (
            <ConnectButton
              label='Sign in'
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          )
        ) : (
          <div className='border-[1px] flex bg-white px-3 py-1 rounded-xl'>
            <Image
              className='rounded-full'
              src={avatar}
              height='30'
              width='30'
              alt='Avatar'
            />
            <div
              className='cursor-pointer'
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <RiArrowDropDownLine size={30} />
            </div>
          </div>
        )}
      </div>
      {isConnected && isOpen && (
        <UserMenu isOpen={isOpen} setOpen={setIsOpen}></UserMenu>
      )}
    </div>
  );
};
