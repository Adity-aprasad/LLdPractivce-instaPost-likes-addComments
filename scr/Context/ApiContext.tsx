import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface FeedItem{
    id:string,
    company:string
}

export interface feedContextType {
  feed: FeedItem[];
  toggleLikes: (id: string) => void;
  addComments: (id: string, newComment: string) => void;
  isLoading: boolean;
  loadMoreData: () => void;
  hasMore: boolean;
  isRefetch:()=>Promise<void>
}


const FeedConText = createContext<feedContextType | undefined>(undefined);

const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 1. Core Fetch Function
  const fetchData = async (pageNum: number,isRefetch:boolean=false) => {
    if (isLoading) return;
    
    setLoading(true);
    try {
      // Replace with your real API URL
      // Example: https://api.example.com/posts?page=1&limit=5
      const response = await fetch(`https://api.example.com/posts?page=${pageNum}&limit=5`);
      
      if (!response.ok) throw new Error('Fetch failed');
      
      const data = await response.json();

      // 2. Data Transformation (Handle backend vs frontend key names)
      const transformedData: FeedItem[] = data.map((item: any) => ({
        id: item.id.toString(),
        user: item.author || "Unknown",
        content: item.text || "",
        likes: item.likes_count || 0,
        isLiked: item.user_has_liked || false,
        comments: item.replies || [],
      }));

      // 3. Update State: APPEND new data to the previous list
      if(isRefetch){
        setFeed(transformedData)
      }else{
         setFeed((prev) => [...prev, ...transformedData]);
      }
     

      // 4. Check if there's more data (Logic depends on your API)
      // Usually, if the API returns fewer items than the limit, we've reached the end
      if (transformedData.length < 5) {
        setHasMore(false);
      }

    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 5. Initial Load
  useEffect(() => {
    fetchData(1);
  }, []);

  // 6. Pagination Trigger
  const loadMoreData = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    }
  };
// refetch function 
  const isRefetch=async()=>{
    setPage(1);
    setHasMore(true);
    await fetchData(1,true)
  }

  const toggleLikes = (id: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item,
             likes: item.isLiked ? item.likes - 1 : item.likes + 1, 
             isLiked: !item.isLiked }
          : item
      )
    );
  };

  const addComments = (id: string, newComment: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, comments: [...item.comments, newComment] } : item
      )
    );
  };

  return (
    <FeedConText.Provider value={{ feed, toggleLikes, addComments, loadMoreData, isLoading, hasMore ,isRefetch}}>
      {children}
    </FeedConText.Provider>
  );
};

export default FeedProvider;
