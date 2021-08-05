// const crm = require('amocrm-js');
const axios = require('axios');
const CrmModel = require('../dbmodels/crm-model');

const api_paths = {
  access_token: 'https://denisiukjob2020.amocrm.ru/oauth2/access_token/',
  add_lead: 'https://denisiukjob2020.amocrm.ru/api/v4/leads',
};

async function firstInit() {
  try {
    let requestParams = {
      client_id: process.env.AMO_CRM_CLIENT_ID,
      client_secret: process.env.AMO_CRM_CLIENT_SECRET,
      redirect_uri: process.env.AMO_CRM_REDIRECT_URI,
      grant_type: 'authorization_code',
      code: process.env.AMO_CRM_CODE,
    };

    let headers = {'Content-Type': 'application/json'};

    await CrmModel.deleteMany({});

    let accessData = await axios.post(api_paths.access_token, requestParams, {headers});
    accessData.data.start_at = new Date().toString();
    let newAccessData = new CrmModel(accessData.data);

    await newAccessData.save();

    // init();
  } catch (error) {
    console.log(error);
  }
}

function init() {
  updateToken();
  startTokenUpdater();
}

function startTokenUpdater() {
  const threeHoursInMilliseconds = 1000 * 60 * 60 * 3;
  const minuteInMilliseconds = 1000 * 60;

  setInterval(async () => {
    await updateToken();
  }, threeHoursInMilliseconds);
}

async function updateToken() {
  try {
    const crmAccessData = await CrmModel.findOne({});
    let requestParams = {
      client_id: process.env.AMO_CRM_CLIENT_ID,
      client_secret: process.env.AMO_CRM_CLIENT_SECRET,
      redirect_uri: process.env.AMO_CRM_REDIRECT_URI,
      grant_type: 'refresh_token',
      refresh_token: crmAccessData.refresh_token,
    };

    let headers = {'Content-Type': 'application/json'};

    await CrmModel.deleteMany({});

    let accessData = await axios.post(api_paths.access_token, requestParams, {headers});
    accessData.data.start_at = new Date().toString();
    let newAccessData = new CrmModel(accessData.data);

    await newAccessData.save();

    return newAccessData;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function addLead(leadData) {
  try {
    let leadsData = [leadData];
    let accessData = await CrmModel.findOne({});
    let headers = {'Content-Type': 'application/json', Authorization: 'Bearer ' + accessData.access_token};
    let lead = await axios.post(api_paths.add_lead, leadsData, {headers});

    return lead.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = {
  firstInit,
  init,
  updateToken,
  addLead,
};
