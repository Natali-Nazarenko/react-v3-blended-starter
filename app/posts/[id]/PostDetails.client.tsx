'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import css from './PostDetails.module.css';
import { useEffect, useState } from 'react';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { User } from '@/types/user';

export default function PostDetailsClient() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const parsedId = Number(id);
  const {
    data: post,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['post', parsedId],
    queryFn: () => fetchPostById(parsedId),
    refetchOnMount: false,
  });

  const handleClickBack = () => {
    router.back();
  };
  useEffect(() => {
    const fn = async () => {
      if (!post) return;
      const fetchedUser = await fetchUserById(post.userId);
      setUser(fetchedUser);
    };
    fn();
  }, [post]);
  if (isLoading) return <p>Loading... Please, wait</p>;
  if (isError) return <p>Something went wrong. Try again</p>;
  return (
    <>
      {post && (
        <section className={css.main}>
          <div className={css.container}>
            <div className={css.item}>
              <button onClick={handleClickBack} className={css.backBtn}>
                ← Back
              </button>

              <div className={css.post}>
                <div className={css.wrapper}>
                  <div className={css.header}>
                    <h2>{post.title}</h2>
                  </div>

                  <p className={css.content}>{post.body}</p>
                </div>
                {user && <p className={css.user}>Author: {user.name}</p>}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
