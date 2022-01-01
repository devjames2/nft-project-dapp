/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Link as RouterLink } from 'react-router-dom';
import shareFill from '@iconify/icons-eva/share-fill';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_ASSET } from '../../../../routes/paths';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fShortenNumber } from '../../../../utils/formatNumber';
//
import SvgIconStyle from '../../../SvgIconStyle';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(RouterLink)(({ theme }) => ({
  ...theme.typography.subtitle2,
  height: 44,
  color: 'inherit',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline'
  }
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

// ItemCard.propTypes = {
//   post: PropTypes.object.isRequired,
//   index: PropTypes.number
// };

export default function ItemCard({ data }) {
  // console.log(data);
  const { metadata, name, tokenAddress, tokenId, tokenUri } = data;
  const linkTo = `${PATH_ASSET.root}/${tokenAddress}/${tokenId}`;
  const tempArr = metadata
    ? String(JSON.parse(metadata).image).replace('ipfs://', '').split('/')
    : 'https://file.mk.co.kr/meet/neds/2021/09/image_readtop_2021_927932_16329132754799395.jpg';
  const cover = metadata
    ? `https://ipfs.infura.io/${tempArr[0]}/${tempArr[1]}/${tempArr[2]}`
    : 'https://file.mk.co.kr/meet/neds/2021/09/image_readtop_2021_927932_16329132754799395.jpg';

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ position: 'relative' }}>
        <CardMediaStyle
          sx={{
            pt: {
              xs: 'calc(100% * 4 / 3)',
              sm: 'calc(100% * 3 / 4.66)'
            },
            '&:after': {
              top: 0,
              content: "''",
              width: '100%',
              height: '100%',
              position: 'absolute'
            }
          }}
        >
          <CoverImgStyle alt={name} src={cover} />
        </CardMediaStyle>

        <CardContent
          sx={{
            pt: 4
          }}
        >
          {/* <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {fDate(createdAt)}
          </Typography> */}

          <TitleStyle to={linkTo}>{name}</TitleStyle>

          {/* <InfoStyle>
            {POST_INFO.map((info, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: index === 0 ? 0 : 1.5
                }}
              >
                <Box component={Icon} icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
              </Box>
            ))}
          </InfoStyle> */}
        </CardContent>
      </Card>
    </Grid>
  );
}
