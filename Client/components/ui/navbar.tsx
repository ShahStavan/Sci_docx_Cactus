"use client";

import { auth, db } from "@/firebase/main";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styled from "styled-components";
import { UserMenu } from "../user-menu";
import { recieveOneData, uploadFirestore } from "@/lib/hooks/get-realtime-data";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { HOME_ROUTE } from "@/lib/constants/route";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({});

  const handleLogin = async (e: any) => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        "hsp22903@gmail.com",
        "1234567890"
      );

      const uid = userCred.user.uid;
      const userDocRef = doc(db, "Users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const DateTime = new Date();
        const Tstamp = Timestamp.fromDate(DateTime);
        await uploadFirestore({
          name: `Users`,
          formData: {
            name: "John Doe",
            token: 3,
            lastOnline: Tstamp,
          },
          doci: uid,
        });

        console.log("User document created");
      } else {
        console.log("User document already exists");
      }

      await recieveOneData({
        dbName: "Users",
        dbID: uid,
        setPosts: setUserInfo,
        setLoading: () => {},
        mode: 0,
      });

      router.push(HOME_ROUTE);
    } catch (err: any) {
      console.error("Firebase Auth Error:", err.code, err.message);
      toast("Authentication Error", {
        description: err.message,
      });
    }
  };

  return (
    <NavBar className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-24 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <h1>
            <b>SciDocx.ai</b>
          </h1>
        </React.Suspense>
      </div>
      <div className="flex items-center">
        {auth.currentUser ? (
          <UserMenu user={userInfo} />
        ) : (
          <button onClick={handleLogin} className="">
            Login
          </button>
        )}
      </div>
    </NavBar>
  );
}

const NavBar = styled.header`
  button {
    cursor: pointer;
    color: #333333;
    font-weight: 500;
    font-size: 17px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  }
`;
