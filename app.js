const express = require('express');
const fs = require('fs');
const option_chain = require('./nse_lib');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
app.use(express.static('public'));
const { GoogleSpreadsheet } = require('google-spreadsheet');

const intDocId = '1asNCwFPE6x2NlmTLK0ciK5Jx_L-jz7mwPSn40Lc5rTM';

app.get('/', (req, res) => res.redirect('/index.html'));
app.get('/chain', async (req, res) => {
    try{
        let resp = await option_chain('NIFTY'); // can enter NIFTY / BANKNIFTY
        let data = await resp.records.data;
        if( '' != data ) {
            let filterData = await data.filter(a => a.expiryDate == resp.records.expiryDates[0]);
            if( '' != filterData ) {
                var excelData = [];
                await filterData.forEach(async (element) => {
                    let prepareElement = await {
                        Strike_Price: element.strikePrice,
                        Expiry_Date: element.expiryDate,
                        CALL_OI: element.CE.openInterest,
                        CALL_VOL: element.CE.totalTradedVolume,
                        CALL_IV: element.CE.impliedVolatility,
                        CALL_LTP: element.CE.lastPrice,
                        PUT_OI: element.PE.openInterest,
                        PUT_VOL: element.PE.totalTradedVolume,
                        PUT_IV: element.PE.impliedVolatility,
                        PUT_LTP: element.PE.lastPrice,
                    };
                    await excelData.push(prepareElement);
                });
                let sortedCallOIData = await excelData;
                let sortedCallVolData = await excelData;                
                let sortedPutOIData = await excelData;
                let sortedPutVolData = await excelData;

                const doc = await new GoogleSpreadsheet(intDocId);

                await doc.useServiceAccountAuth({
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
                });
                // let docInfo = await doc.loadInfo(); // loads document properties and worksheets
                let arrHeaderValues = ['Strike_Price','Expiry_Date','CALL_OI','CALL_VOL','CALL_IV','CALL_LTP','PUT_OI','PUT_VOL','PUT_IV','PUT_LTP'];
                const newSheet = await doc.addSheet({ headerValues: arrHeaderValues });

                await sortedCallOIData.sort(GetSortOrder("CALL_OI"));
                await newSheet.addRow({Strike_Price: 'CALL OI Sorted Data'});
                await newSheet.addRows(sortedCallOIData);
                
                await sortedCallVolData.sort(GetSortOrder("CALL_VOL"));
                await newSheet.addRow({Strike_Price: 'CALL VOLUME Sorted Data'});
                await newSheet.addRows(sortedCallVolData);
                
                await sortedPutOIData.sort(GetSortOrder("PUT_OI"));
                await newSheet.addRow({Strike_Price: 'PUT OI Sorted Data'});
                await newSheet.addRows(sortedPutOIData);
                
                await sortedPutVolData.sort(GetSortOrder("PUT_VOL"));
                await newSheet.addRow({Strike_Price: 'PUT VOLUME Sorted Data'});
                await newSheet.addRows(sortedPutVolData);
                await newSheet.updateProperties({ title: new Date().toLocaleString() });
                res.send(excelData);
            } else {
                res.send(filterData);
            }
        } else {
            res.send(resp);
        }

    }catch(err){
        res.status(500).send(err);
    }
});

function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] < b[prop]) {    
            return 1;    
        } else if (a[prop] > b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}  

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
