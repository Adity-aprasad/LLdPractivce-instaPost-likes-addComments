import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

// structure of a single feed item
export interface FeedItem {
  id: string;
  user: string;
  content: string;
  likes: number;
  isLiked: boolean;
  comments: string[];
}

// definds the context
export interface feedContextType {
  feed: FeedItem[];
  toggleLikes: (id: string) => void;
  addComments: (id: string, newComment: string) => void;
  isLoading:boolean;

}
const FeedConText = createContext<feedContextType | undefined>(undefined);
interface prop {
  children: ReactNode;
}

const FeedProvider = ({ children }: prop) => {
  const [feed, setFeed] = useState<FeedItem[]>([
    {
      id: "1",
      user: "Ravi",
      content: "Looking for a delivery job in Bangalore",
      likes: 5,
      isLiked: false,
      comments: ["Try Swiggy", "Check Zomato careers"],
    },
    {
      id: "2",
      user: "Anita",
      content: "Best coaching center in Mysore?",
      likes: 3,
      isLiked: false,
      comments: ["ABC Academy is good"],
    },
    {
      id: "3",
      user: "Raj",
      content: "hidden place in bangalore",
      likes: 4,
      isLiked: true,
      comments: ["Try Swiggy", "hokenekana is good to visite "],
    },
    {
      id: "4",
      user: "Aditya",
      content: "Best coaching center in Mysore?",
      likes: 3,
      isLiked: false,
      comments: ["ABC Academy is good"],
    },
  ]);
const [isLoading,setLoading]=useState(true)
const [haveError,setError]=useState('');

  const fetchData=async()=>{
    try{
      // if the data matches the interface
      // const responce= await  fetch('https://api.example.com/user/1');
      // const data=await responce.json(); 
      // setFeed(data)

      // if the data does not matches or want to keep different name in front end and backend
      const responce= await fetch('the api fetch falied')
      if(!responce.ok) throw new Error()
      const data = await responce.json()
   const transFormData:FeedItem[]=data.map((item)=>({

   }))
    setFeed(transFormData)

    }catch(err){
      throw new Error('the api fetch falied')
      setError('the api fetch falied')

    }finally{
      setLoading(false)
    }
  }


  useEffect(()=>{
    fetchData()
  },[])

  const toggleLikes = (id: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
              isLiked: !item.isLiked,
            }
          : item,
      ),
    );
  };

  const addComments = (id: string, newComment: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              comments: [...item.comments, newComment],
            }
          : item,
      ),
    );
  };

  return (
    <FeedConText.Provider value={{ feed, toggleLikes, addComments }}>
      {children}
    </FeedConText.Provider>
  );
};

export default FeedProvider;

export const useFeed = () => {
  const context = useContext(FeedConText);
  if (!context) {
    throw new Error("should be used with a child ");
  }
  return context;
};
