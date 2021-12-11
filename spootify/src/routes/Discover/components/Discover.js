import React, { useState, useEffect } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import axios from 'axios';
import '../styles/_discover.scss';
import request from 'request';

import conf from '../../../config';

const dataInstance = axios.create({
  baseURL: conf.api.baseUrl,
  headers: { "Content-type": "application/json; charset=UTF-8" }
});

const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(conf.api.clientId + ':' + conf.api.clientSecret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

const Discover = () => {
  const [state, setState] = useState({
    newReleases: [],
    playlists: [],
    categories: []
  });

  const [token, setToken] = useState('');
  
  // Authentication 
  useEffect(() => {
    async function fetchAuthData() {
      try {
        request.post(authOptions, async function (error, response, body) {
          if (!error && response.statusCode === 200) {
            setToken(body.access_token);
          }
        });
      } catch (error) {
        console.log("Error:", error);
      }
    }

    fetchAuthData();
  }, []);

  // Get Featured Playlist
  useEffect(() => {
    async function getFeaturedPlaylists() {
      try {
        const result = await dataInstance.request({
          method: 'GET',
          url: '/browse/featured-playlists',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        if (result.status == 200) {
          setState({
            ...state,
            playlists: result.data.playlists.items
          })
        }
      } catch (error) {
        console.log("Error:", error);
      }
    }

    getFeaturedPlaylists();

  }, [token]);

  // Get New Releases
  useEffect(() => {
    async function getNewReleases() {
      try {
        const result = await dataInstance.request({
          method: 'GET',
          url: '/browse/new-releases',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        if (result.status == 200) {
          
          setState({
            ...state,
            newReleases: result.data.albums.items
          })
        }
      } catch (error) {
        console.log("Error:", error);
      }
    }

    getNewReleases();

  }, [token]);

  // Get Browser Categories
  useEffect(() => {
    async function getBrowseCategories() {
      try {
        const result = await dataInstance.request({
          method: 'GET',
          url: '/browse/categories',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        if (result.status == 200) {
          setState({
            ...state,
            categories: result.data.categories.items
          })
        }
      } catch (error) {
        console.log("Error:", error);
      }
    }

    getBrowseCategories();

  }, [token]);

  return (
    <div className="discover">
      <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={state.newReleases} />
      <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={state.playlists} />
      <DiscoverBlock text="BROWSE" id="browse" data={state.categories} imagesKey="icons" />
    </div>
  );

}

export default Discover;