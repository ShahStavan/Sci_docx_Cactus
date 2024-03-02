import { db } from "@/firebase/main";
import {
  collection,
  onSnapshot,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

interface Post {
  key: string;
  // Add other fields as needed
}

interface Props {
  ele1?: any;
  ele2?: any;
  setPosts: (posts: Post[]) => void;
  setLoading: (loading: boolean) => void;
  mode?: number;
  //   filter?: QueryConstraint[];
  queryName?: any;
}

interface Propsy {
  dbName?: any;
  setPosts: any;
  setLoading: (loading: boolean) => void;
  dbID?: any;
  uid?: any;
  mode?: number;
}

interface Uploady {
  name?: any;
  formData?: any;
  doci?: any;
}

interface DataCheck {
  name?: any;
  doci?: any;
}

export const getData = ({
  queryName,
  setPosts,
  setLoading,
  mode,
  ele1,
  ele2,
}: Props) => {
  setLoading(true);
  if (!db) {
    setLoading(false);
    return;
  }

  let q;
  if (mode === 1) {
    q = query(
      collection(db, queryName),
      orderBy("date", "desc"),
      where(ele1, "==", ele2)
    );
  } else {
    q = query(collection(db, queryName), orderBy("date", "desc"));
  }

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const getPostsFromFirebase: Post[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      getPostsFromFirebase.push({
        ...doc.data(),
        key: doc.id,
      });
    });
    setPosts(getPostsFromFirebase);
    setLoading(false);
  });

  return unsubscribe;
};

export const getSingleData = ({ queryName, setPosts, setLoading }: Props) => {
  setLoading(true);
  if (!db) {
    setLoading(false);
    return;
  }

  const q = query(collection(db, queryName), orderBy("date", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const getPostsFromFirebase: Post[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      getPostsFromFirebase.push({
        ...doc.data(),
        key: doc.id,
      });
    });
    setPosts(getPostsFromFirebase);
    setLoading(false);
  });

  return unsubscribe;
};

export const recieveOneData = async ({
  dbName,
  dbID,
  setPosts,
  mode,
  uid,
}: Propsy) => {
  if (mode == 1) {
    const docRef = uid
      ? doc(db, "Users", uid, dbName, dbID)
      : doc(db, dbName, dbID);
    setPosts((await getDoc(docRef)).data());
  } else {
    const docRef = doc(db, dbName, dbID);
    onSnapshot(docRef, (doc) => {
      setPosts(doc.data());
    });
  }
};

export const uploadFirestore = async ({ name, formData, doci }: Uploady) => {
  const newCityRef = doc(db, name, doci);

  // later...
  await setDoc(newCityRef, formData);
};

export const dataExists = async ({ name, doci }: DataCheck) => {
  const docRef = doc(db, name, doci);

  // later...
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return true;
  } else {
    // docSnap.data() will be undefined in this case
    return false;
  }
};


