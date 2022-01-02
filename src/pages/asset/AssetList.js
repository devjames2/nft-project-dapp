import { orderBy } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useCallback, useState } from 'react';
// material
import { Box, Grid, Button, Skeleton, Container, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getPostsInitial, getMorePosts } from '../../redux/slices/blog';
import { getLazyMintedItems, getListedSellItems } from '../../redux/slices/assets';
// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import { ItemCard, ItemSearch } from '../../components/_dashboard/asset/list';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../components/_dashboard/blog';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' }
];

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }
  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc']);
  }
  return posts;
};

const SkeletonLoad = (
  <Grid container spacing={3} sx={{ mt: 2 }}>
    {[...Array(4)].map((_, index) => (
      <Grid item xs={12} md={3} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ height: 200, borderRadius: 2 }} />
        <Box sx={{ display: 'flex', mt: 1.5 }}>
          <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
          <Skeleton variant="text" sx={{ mx: 1, flexGrow: 1 }} />
        </Box>
      </Grid>
    ))}
  </Grid>
);

export default function AssetList() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState('latest');
  const { posts, hasMore, index, step } = useSelector((state) => state.blog);
  const { itemList, listedSellItems, listedSellItem } = useSelector((state) => state.assets);
  const sortedPosts = applySort(posts, filters);
  const onScroll = useCallback(() => dispatch(getMorePosts()), [dispatch]);

  useEffect(() => {
    dispatch(getPostsInitial(index, step));
  }, [dispatch, index, step]);

  useEffect(() => {
    dispatch(getLazyMintedItems());
  }, [dispatch]);

  useEffect(() => {
    console.log(listedSellItems);
  }, [listedSellItems]);

  const handleChangeSort = (event) => {
    setFilters(event.target.value);
  };

  return (
    <Page title="Blog: Posts | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Items"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Asset', href: PATH_DASHBOARD.blog.root },
            { name: 'Items' }
          ]}
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <ItemSearch />
          <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
        </Stack>

        <InfiniteScroll
          next={onScroll}
          // hasMore={hasMore}
          loader={SkeletonLoad}
          dataLength={listedSellItems.length}
          style={{ overflow: 'inherit' }}
        >
          <Grid container spacing={3}>
            {/* {sortedPosts.map((post, index) => (
              <ItemCard key={post.id} post={post} index={index} />
            ))} */}
            {listedSellItems.map((item) => (
              <ItemCard key={item._id} data={item} />
            ))}
          </Grid>
        </InfiniteScroll>
      </Container>
    </Page>
  );
}
