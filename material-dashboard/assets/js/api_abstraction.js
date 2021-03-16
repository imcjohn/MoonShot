/**
 * Holds api calls, according to spec in api-defs.txt
 * Author: @ia.n.stagram
 */

/**
 * Get price for stock on server
 * @param stock stock to get price for
 * @returns promise to the price of the stock
 */
function api_get_price(stock){
    if (!SYMBOLS.includes(stock)){
        alert('Please pick a valid stock symbol');
        return api_get_price('MSFT');
    }

    return     fetch(`api/ticker?symbol=${stock}`)
        .then(response => response.text());
}

/**
 * Execute either a buy or sell on the server
 * @param stock stock symbol to execute on
 * @param qty attempted quantity to execute
 * @param type either 'BUY' or 'SELL'
 * @returns true on success, otherwise false
 */
function api_execute(stock, qty, type){
    stock = stock.toUpperCase();
    console.log(`Executing: operation ${type} with quantity ${qty} and symbol ${stock}`);

    if (!SYMBOLS.includes(stock)){
        alert('Please pick a valid stock symbol');
        return false;
    }

    let nmb = parseInt(qty)
    if (isNaN(nmb) || nmb <= 0){
        alert('Please enter a valid quantity');
        return false;
    }

    let url = (type == 'BUY')? 'api/buy' : 'api/sell';
    fetch(url + `?symbol=${stock}&qty=${qty}&password=${pass}`)
        .then(response => response.text())
        .then(function(data){
            if (data.includes('OK'))
                location.reload();
            else
                alert('Execution failed, please check syntax');
        });
    return false;
}

/**
 * Acquire data to populate holdings fields
 * @param cb function of format populate_tickers(row_dict, cash) (see current_holdings.js for impl)
 */
function api_populate(cb){
    fetch(`api/info?password=${pass}`)
        .then(response => response.json())
        .then(function(data){
            let cash = data['USD']['qty'];
            delete data['USD'];
            cb(data, cash);
        });
}

/**
 * Return a promise to the in-game datetime
 */
function api_datetime(){
    return     fetch(`api/time`)
        .then(response => response.text())
        .then(response => new Date(response));
}

// all nasd symbols, save the server-side some checking
let SYMBOLS = ['AACG', 'AACQ', 'AACQU', 'AACQW', 'AAL', 'AAME', 'AAOI', 'AAON', 'AAPL', 'AAWW', 'AAXJ', 'ABCB', 'ABCL', 'ABCM', 'ABEO', 'ABGI', 'ABIO', 'ABMD', 'ABNB', 'ABST', 'ABTX', 'ABUS', 'ACAC', 'ACACU', 'ACACW', 'ACAD', 'ACAHU', 'ACBI', 'ACCD', 'ACER', 'ACET', 'ACEV', 'ACEVU', 'ACEVW', 'ACGL', 'ACGLO', 'ACGLP', 'ACHC', 'ACHV', 'ACIU', 'ACIW', 'ACKIT', 'ACKIU', 'ACKIW', 'ACLS', 'ACMR', 'ACNB', 'ACOR', 'ACQRU', 'ACRS', 'ACRX', 'ACST', 'ACTC', 'ACTCU', 'ACTCW', 'ACTG', 'ACWI', 'ACWX', 'ADAG', 'ADAP', 'ADBE', 'ADER', 'ADERU', 'ADERW', 'ADES', 'ADI', 'ADIL', 'ADILW', 'ADMA', 'ADMP', 'ADMS', 'ADN', 'ADNWW', 'ADOC', 'ADOCR', 'ADOCW', 'ADP', 'ADPT', 'ADRE', 'ADSK', 'ADTN', 'ADTX', 'ADUS', 'ADV', 'ADVM', 'ADVWW', 'ADXN', 'ADXS', 'AEAC', 'AEACU', 'AEACW', 'AEGN', 'AEHL', 'AEHR', 'AEI', 'AEIS', 'AEMD', 'AEP', 'AEPPL', 'AEPPZ', 'AERI', 'AESE', 'AEY', 'AEYE', 'AEZS', 'AFBI', 'AFIB', 'AFIN', 'AFINO', 'AFINP', 'AFMD', 'AFRM', 'AFYA', 'AGBA', 'AGBAR', 'AGBAU', 'AGBAW', 'AGC', 'AGCUU', 'AGCWW', 'AGEN', 'AGFS', 'AGFY', 'AGGRU', 'AGIO', 'AGLE', 'AGMH', 'AGNC', 'AGNCM', 'AGNCN', 'AGNCO', 'AGNCP', 'AGRX', 'AGTC', 'AGYS', 'AGZD', 'AHAC', 'AHACU', 'AHACW', 'AHCO', 'AHPI', 'AIA', 'AIH', 'AIHS', 'AIKI', 'AIMC', 'AINV', 'AIQ', 'AIRG', 'AIRR', 'AIRT', 'AIRTP', 'AIRTW', 'AKAM', 'AKBA', 'AKER', 'AKIC', 'AKICU', 'AKICW', 'AKRO', 'AKTS', 'AKTX', 'AKU', 'AKUS', 'ALAC', 'ALACR', 'ALACU', 'ALACW', 'ALBO', 'ALCO', 'ALDX', 'ALEC', 'ALGM', 'ALGN', 'ALGS', 'ALGT', 'ALIM', 'ALJJ', 'ALKS', 'ALLK', 'ALLO', 'ALLT', 'ALNA', 'ALNY', 'ALOT', 'ALPN', 'ALRM', 'ALRN', 'ALRS', 'ALSK', 'ALT', 'ALTA', 'ALTM', 'ALTO', 'ALTR', 'ALTU', 'ALTUU', 'ALTUW', 'ALTY', 'ALVR', 'ALXN', 'ALXO', 'ALYA', 'AMAL', 'AMAT', 'AMBA', 'AMCA', 'AMCX', 'AMD', 'AMED', 'AMEH', 'AMGN', 'AMHC', 'AMHCU', 'AMHCW', 'AMKR', 'AMNB', 'AMOT', 'AMPG', 'AMPGW', 'AMPH', 'AMRB', 'AMRK', 'AMRN', 'AMRS', 'AMSC', 'AMSF', 'AMST', 'AMSWA', 'AMTB', 'AMTBB', 'AMTI', 'AMTX', 'AMWD', 'AMYT', 'AMZN', 'ANAB', 'ANAT', 'ANCN', 'ANDA', 'ANDAR', 'ANDAU', 'ANDAW', 'ANDE', 'ANGI', 'ANGL', 'ANGN', 'ANGO', 'ANIK', 'ANIP', 'ANIX', 'ANNX', 'ANPC', 'ANSS', 'ANTE', 'ANY', 'ANZUU', 'AOSL', 'AOUT', 'APA', 'APDN', 'APEI', 'APEN', 'APHA', 'API', 'APLS', 'APLT', 'APM', 'APOG', 'APOP', 'APOPW', 'APPF', 'APPH', 'APPHW', 'APPN', 'APPS', 'APR', 'APRE', 'APTO', 'APTX', 'APVO', 'APWC', 'APXT', 'APXTU', 'APXTW', 'APYX', 'AQB', 'AQMS', 'AQST', 'ARAV', 'ARAY', 'ARBG', 'ARBGU', 'ARBGW', 'ARCB', 'ARCC', 'ARCE', 'ARCT', 'ARDS', 'ARDX', 'AREC', 'ARGX', 'ARKO', 'ARKOW', 'ARKR', 'ARLP', 'ARNA', 'AROW', 'ARPO', 'ARQT', 'ARRWU', 'ARRY', 'ARTL', 'ARTLW', 'ARTNA', 'ARTW', 'ARVN', 'ARWR', 'ARYA', 'ARYD', 'ASAX', 'ASAXU', 'ASAXW', 'ASET', 'ASLE', 'ASLEW', 'ASLN', 'ASMB', 'ASML', 'ASND', 'ASO', 'ASPCU', 'ASPS', 'ASPU', 'ASRT', 'ASRV', 'ASRVP', 'ASTC', 'ASTE', 'ASUR', 'ASYS', 'ATAX', 'ATCX', 'ATEC', 'ATEX', 'ATHA', 'ATHE', 'ATHX', 'ATIF', 'ATLC', 'ATLO', 'ATNF', 'ATNFW', 'ATNI', 'ATNX', 'ATOM', 'ATOS', 'ATRA', 'ATRC', 'ATRI', 'ATRO', 'ATRS', 'ATSG', 'ATSPU', 'ATVCU', 'ATVI', 'ATXI', 'AUB', 'AUBAP', 'AUBN', 'AUDC', 'AUPH', 'AURCU', 'AUTL', 'AUTO', 'AUUD', 'AUUDW', 'AUVI', 'AVAV', 'AVCO', 'AVCT', 'AVCTW', 'AVDL', 'AVEO', 'AVGO', 'AVGOP', 'AVGR', 'AVID', 'AVIR', 'AVNW', 'AVO', 'AVRO', 'AVT', 'AVXL', 'AWH', 'AWRE', 'AXAS', 'AXDX', 'AXGN', 'AXLA', 'AXNX', 'AXON', 'AXSM', 'AXTI', 'AY', 'AYLA', 'AYRO', 'AYTU', 'AZN', 'AZPN', 'AZRX', 'AZYO', 'BAND', 'BANF', 'BANFP', 'BANR', 'BANX', 'BAOS', 'BASI', 'BATRA', 'BATRK', 'BBBY', 'BBCP', 'BBGI', 'BBH', 'BBI', 'BBIG', 'BBIO', 'BBQ', 'BBSI', 'BCAB', 'BCAC', 'BCACU', 'BCACW', 'BCBP', 'BCDA', 'BCDAW', 'BCEL', 'BCLI', 'BCML', 'BCOR', 'BCOV', 'BCOW', 'BCPC', 'BCRX', 'BCTG', 'BCTX', 'BCTXW', 'BCYC', 'BCYP', 'BCYPU', 'BCYPW', 'BDSI', 'BDSX', 'BDTX', 'BEAM', 'BECN', 'BEEM', 'BEEMW', 'BELFA', 'BELFB', 'BENE', 'BENER', 'BENEU', 'BENEW', 'BFC', 'BFI', 'BFIIW', 'BFIN', 'BFIT', 'BFRA', 'BFST', 'BGCP', 'BGFV', 'BGNE', 'BGRN', 'BHAT', 'BHF', 'BHFAL', 'BHFAN', 'BHFAO', 'BHFAP', 'BHSE', 'BHSEU', 'BHSEW', 'BHTG', 'BIB', 'BICK', 'BIDU', 'BIGC', 'BIIB', 'BILI', 'BIMI', 'BIOC', 'BIOL', 'BIOTU', 'BIS', 'BIVI', 'BJK', 'BJRI', 'BKCC', 'BKEP', 'BKEPP', 'BKNG', 'BKSC', 'BKYI', 'BL', 'BLBD', 'BLCM', 'BLCN', 'BLCT', 'BLDP', 'BLDR', 'BLFS', 'BLI', 'BLIN', 'BLKB', 'BLMN', 'BLNK', 'BLNKW', 'BLPH', 'BLRX', 'BLSA', 'BLTS', 'BLTSU', 'BLTSW', 'BLU', 'BLUE', 'BLUW', 'BLUWU', 'BLUWW', 'BMBL', 'BMRA', 'BMRC', 'BMRN', 'BMTC', 'BND', 'BNDW', 'BNDX', 'BNFT', 'BNGO', 'BNGOW', 'BNR', 'BNSO', 'BNTC', 'BNTX', 'BOCH', 'BOKF', 'BOKFL', 'BOLT', 'BOMN', 'BOOM', 'BOSC', 'BOTJ', 'BOTZ', 'BOWX', 'BOWXU', 'BOWXW', 'BOXL', 'BPFH', 'BPMC', 'BPOP', 'BPOPM', 'BPOPN', 'BPRN', 'BPTH', 'BPTS', 'BPY', 'BPYPN', 'BPYPO', 'BPYPP', 'BPYU', 'BPYUP', 'BREZ', 'BREZR', 'BREZW', 'BRID', 'BRKL', 'BRKR', 'BRKS', 'BRLI', 'BRLIR', 'BRLIU', 'BRLIW', 'BROG', 'BROGW', 'BRP', 'BRPA', 'BRPAR', 'BRPAU', 'BRPAW', 'BRPMU', 'BRQS', 'BRY', 'BSAE', 'BSBE', 'BSBK', 'BSCE', 'BSCL', 'BSCM', 'BSCN', 'BSCO', 'BSCP', 'BSCQ', 'BSCR', 'BSCS', 'BSCT', 'BSCU', 'BSDE', 'BSET', 'BSGM', 'BSJL', 'BSJM', 'BSJN', 'BSJO', 'BSJP', 'BSJQ', 'BSJR', 'BSJS', 'BSML', 'BSMM', 'BSMN', 'BSMO', 'BSMP', 'BSMQ', 'BSMR', 'BSMS', 'BSMT', 'BSMU', 'BSPE', 'BSQR', 'BSRR', 'BSVN', 'BSY', 'BTAI', 'BTAQ', 'BTAQU', 'BTAQW', 'BTBT', 'BTEC', 'BTNB', 'BTRS', 'BTRSW', 'BTWN', 'BTWNU', 'BTWNW', 'BUG', 'BUSE', 'BVS', 'BVXV', 'BWAC', 'BWACU', 'BWACW', 'BWAY', 'BWB', 'BWEN', 'BWFG', 'BWMX', 'BXRX', 'BYFC', 'BYND', 'BYSI', 'BZUN', 'CAAS', 'CABA', 'CAC', 'CACC', 'CACG', 'CAHC', 'CAHCU', 'CAHCW', 'CAKE', 'CALA', 'CALB', 'CALM', 'CALT', 'CAMP', 'CAMT', 'CAN', 'CAPA', 'CAPAU', 'CAPAW', 'CAPR', 'CAR', 'CARA', 'CARE', 'CARG', 'CARV', 'CARZ', 'CASA', 'CASH', 'CASI', 'CASS', 'CASY', 'CATB', 'CATC', 'CATH', 'CATM', 'CATY', 'CBAN', 'CBAT', 'CBAY', 'CBFV', 'CBIO', 'CBLI', 'CBMB', 'CBNK', 'CBPO', 'CBRL', 'CBSH', 'CBTX', 'CCAP', 'CCB', 'CCBG', 'CCCC', 'CCD', 'CCLP', 'CCMP', 'CCNC', 'CCNE', 'CCNEP', 'CCOI', 'CCRC', 'CCRN', 'CCXI', 'CD', 'CDAK', 'CDC', 'CDEV', 'CDK', 'CDL', 'CDLX', 'CDMO', 'CDMOP', 'CDNA', 'CDNS', 'CDTX', 'CDW', 'CDXC', 'CDXS', 'CDZI', 'CECE', 'CEFA', 'CELC', 'CELH', 'CEMI', 'CENHU', 'CENT', 'CENTA', 'CENX', 'CERC', 'CERE', 'CEREW', 'CERN', 'CERS', 'CERT', 'CETX', 'CETXP', 'CETXW', 'CEVA', 'CEY', 'CEZ', 'CFA', 'CFAC', 'CFACU', 'CFACW', 'CFB', 'CFBK', 'CFFEU', 'CFFI', 'CFFN', 'CFFVU', 'CFIV', 'CFIVU', 'CFIVW', 'CFMS', 'CFO', 'CFRX', 'CFVIU', 'CG', 'CGBD', 'CGC', 'CGEM', 'CGEN', 'CGIX', 'CGNT', 'CGNX', 'CGO', 'CGRO', 'CGROU', 'CGROW', 'CHB', 'CHCI', 'CHCO', 'CHDN', 'CHEF', 'CHEK', 'CHEKZ', 'CHFS', 'CHI', 'CHK', 'CHKEL', 'CHKEW', 'CHKEZ', 'CHKP', 'CHMA', 'CHMG', 'CHNA', 'CHNG', 'CHNGU', 'CHNR', 'CHPM', 'CHPMU', 'CHPMW', 'CHRS', 'CHRW', 'CHSCL', 'CHSCM', 'CHSCN', 'CHSCO', 'CHSCP', 'CHTR', 'CHUY', 'CHW', 'CHX', 'CHY', 'CIBR', 'CID', 'CIDM', 'CIGI', 'CIH', 'CIIC', 'CIICU', 'CIICW', 'CIL', 'CINF', 'CIVB', 'CIZ', 'CIZN', 'CJJD', 'CKPT', 'CLAR', 'CLBK', 'CLBS', 'CLDB', 'CLDX', 'CLEU', 'CLFD', 'CLGN', 'CLIR', 'CLLS', 'CLMT', 'CLNE', 'CLNN', 'CLNNW', 'CLOU', 'CLOV', 'CLOVW', 'CLPS', 'CLPT', 'CLRB', 'CLRBZ', 'CLRG', 'CLRMU', 'CLRO', 'CLSD', 'CLSK', 'CLSN', 'CLVR', 'CLVRW', 'CLVS', 'CLWT', 'CLXT', 'CMBM', 'CMCO', 'CMCSA', 'CMCT', 'CMCTP', 'CME', 'CMFNL', 'CMIIU', 'CMLF', 'CMLFU', 'CMLFW', 'CMLS', 'CMPI', 'CMPR', 'CMPS', 'CMRX', 'CMTL', 'CNBKA', 'CNCE', 'CNCR', 'CNDT', 'CNET', 'CNEY', 'CNFR', 'CNFRL', 'CNNB', 'CNOB', 'CNSL', 'CNSP', 'CNST', 'CNTG', 'CNTY', 'CNXC', 'CNXN', 'COCP', 'CODA', 'CODX', 'COFS', 'COGT', 'COHR', 'COHU', 'COKE', 'COLB', 'COLIU', 'COLL', 'COLM', 'COMM', 'COMS', 'COMSW', 'COMT', 'CONE', 'CONN', 'CONX', 'CONXU', 'CONXW', 'COOL', 'COOLU', 'COOLW', 'COOP', 'CORE', 'CORT', 'COST', 'COUP', 'COVAU', 'COWN', 'COWNL', 'COWNZ', 'CPHC', 'CPIX', 'CPLP', 'CPRT', 'CPRX', 'CPSH', 'CPSI', 'CPSS', 'CPST', 'CPTA', 'CPTAG', 'CPTAL', 'CPZ', 'CRAI', 'CRBP', 'CRDF', 'CREE', 'CREG', 'CRESY', 'CREX', 'CREXW', 'CRIS', 'CRKN', 'CRMD', 'CRMT', 'CRNC', 'CRNT', 'CRNX', 'CRON', 'CROX', 'CRSA', 'CRSAU', 'CRSAW', 'CRSP', 'CRSR', 'CRTD', 'CRTDW', 'CRTO', 'CRTX', 'CRUS', 'CRVL', 'CRVS', 'CRWD', 'CRWS', 'CSA', 'CSB', 'CSBR', 'CSCO', 'CSCW', 'CSF', 'CSGP', 'CSGS', 'CSII', 'CSIQ', 'CSML', 'CSOD', 'CSPI', 'CSQ', 'CSSE', 'CSSEN', 'CSSEP', 'CSTE', 'CSTL', 'CSTR', 'CSWC', 'CSWI', 'CSX', 'CTAQ', 'CTAQU', 'CTAQW', 'CTAS', 'CTBI', 'CTEC', 'CTG', 'CTHR', 'CTIB', 'CTIC', 'CTMX', 'CTRE', 'CTRM', 'CTRN', 'CTSH', 'CTSO', 'CTXR', 'CTXRW', 'CTXS', 'CUBA', 'CUE', 'CUEN', 'CUENW', 'CURI', 'CURIW', 'CUTR', 'CVAC', 'CVBF', 'CVCO', 'CVCY', 'CVET', 'CVGI', 'CVGW', 'CVLG', 'CVLT', 'CVLY', 'CVV', 'CWBC', 'CWBR', 'CWCO', 'CWST', 'CXDC', 'CXDO', 'CXSE', 'CYAD', 'CYAN', 'CYBE', 'CYBR', 'CYCC', 'CYCCP', 'CYCN', 'CYRN', 'CYRX', 'CYTH', 'CYTHW', 'CYTK', 'CZNC', 'CZR', 'CZWI', 'DADA', 'DAIO', 'DAKT', 'DALI', 'DARE', 'DAX', 'DBDR', 'DBDRU', 'DBDRW', 'DBTX', 'DBVT', 'DBX', 'DCBO', 'DCOM', 'DCOMP', 'DCPH', 'DCRB', 'DCRBU', 'DCRBW', 'DCRNU', 'DCT', 'DCTH', 'DDIV', 'DDMX', 'DDMXU', 'DDMXW', 'DDOG', 'DEMZ', 'DENN', 'DFFN', 'DFH', 'DFHT', 'DFHTU', 'DFHTW', 'DFNL', 'DFPH', 'DFPHU', 'DFPHW', 'DGICA', 'DGICB', 'DGII', 'DGLY', 'DGNS', 'DGRE', 'DGRS', 'DGRW', 'DHBCU', 'DHC', 'DHCAU', 'DHCNI', 'DHCNL', 'DHHCU', 'DHIL', 'DINT', 'DIOD', 'DISCA', 'DISCB', 'DISCK', 'DISH', 'DJCO', 'DKNG', 'DLCA', 'DLCAU', 'DLCAW', 'DLHC', 'DLPN', 'DLTH', 'DLTR', 'DMAC', 'DMLP', 'DMRC', 'DMTK', 'DMXF', 'DNLI', 'DOCU', 'DOGZ', 'DOMO', 'DOOO', 'DORM', 'DOX', 'DOYU', 'DRIO', 'DRIV', 'DRNA', 'DRRX', 'DRTT', 'DRVN', 'DSAC', 'DSACU', 'DSACW', 'DSGX', 'DSKE', 'DSKEW', 'DSP', 'DSPG', 'DSWL', 'DTEA', 'DTIL', 'DTOCU', 'DTSS', 'DUNE', 'DUNEU', 'DUNEW', 'DUO', 'DUOT', 'DUSA', 'DVAX', 'DVLU', 'DVOL', 'DVY', 'DWAS', 'DWAT', 'DWAW', 'DWCR', 'DWEQ', 'DWFI', 'DWLD', 'DWMC', 'DWPP', 'DWSH', 'DWSN', 'DWUS', 'DXCM', 'DXGE', 'DXJS', 'DXPE', 'DXYN', 'DYAI', 'DYN', 'DYNT', 'DZSI', 'EA', 'EAC', 'EACPU', 'EACPW', 'EAR', 'EARS', 'EAST', 'EBAY', 'EBC', 'EBIX', 'EBIZ', 'EBMT', 'EBON', 'EBSB', 'EBTC', 'ECHO', 'ECOL', 'ECOLW', 'ECOR', 'ECOW', 'ECPG', 'EDAP', 'EDIT', 'EDOC', 'EDRY', 'EDSA', 'EDTK', 'EDTX', 'EDTXU', 'EDTXW', 'EDUC', 'EDUT', 'EEFT', 'EEMA', 'EFAS', 'EFOI', 'EFSC', 'EGAN', 'EGBN', 'EGLE', 'EGOV', 'EGRX', 'EH', 'EHTH', 'EIGR', 'EJFAU', 'EKSO', 'ELDN', 'ELOX', 'ELSE', 'ELTK', 'ELYS', 'EMB', 'EMCB', 'EMCF', 'EMIF', 'EMKR', 'EML', 'EMXC', 'EMXF', 'ENDP', 'ENFA', 'ENFAU', 'ENFAW', 'ENG', 'ENLV', 'ENNVU', 'ENOB', 'ENPH', 'ENSG', 'ENTA', 'ENTG', 'ENTX', 'ENTXW', 'ENVB', 'ENVI', 'ENVIU', 'ENVIW', 'ENZL', 'EOLS', 'EOSE', 'EOSEW', 'EPAY', 'EPHY', 'EPHYU', 'EPHYW', 'EPIX', 'EPSN', 'EPZM', 'EQ', 'EQBK', 'EQIX', 'EQOS', 'EQOSW', 'EQRR', 'ERES', 'ERESU', 'ERESW', 'ERIC', 'ERIE', 'ERII', 'ERYP', 'ESBK', 'ESCA', 'ESEA', 'ESGD', 'ESGE', 'ESGR', 'ESGRO', 'ESGRP', 'ESGU', 'ESLT', 'ESPO', 'ESPR', 'ESQ', 'ESSA', 'ESSC', 'ESSCR', 'ESSCU', 'ESSCW', 'ESTA', 'ESXB', 'ETAC', 'ETACU', 'ETACW', 'ETNB', 'ETON', 'ETSY', 'ETTX', 'EUCR', 'EUCRU', 'EUCRW', 'EUFN', 'EUSG', 'EUSGU', 'EUSGW', 'EVAX', 'EVBG', 'EVER', 'EVFM', 'EVGBC', 'EVGN', 'EVK', 'EVLMC', 'EVLO', 'EVOJU', 'EVOK', 'EVOL', 'EVOP', 'EVSTC', 'EWBC', 'EWEB', 'EWJE', 'EWJV', 'EWZS', 'EXAS', 'EXC', 'EXEL', 'EXFO', 'EXLS', 'EXPC', 'EXPCU', 'EXPCW', 'EXPD', 'EXPE', 'EXPI', 'EXPO', 'EXTR', 'EYE', 'EYEG', 'EYEN', 'EYES', 'EYESW', 'EYPT', 'EZGO', 'EZPW', 'FAAR', 'FAB', 'FAD', 'FALN', 'FAMI', 'FANG', 'FANH', 'FARM', 'FARO', 'FAST', 'FAT', 'FATBP', 'FATBW', 'FATE', 'FB', 'FBIO', 'FBIOP', 'FBIZ', 'FBMS', 'FBNC', 'FBRX', 'FBSS', 'FBZ', 'FCA', 'FCAC', 'FCACU', 'FCACW', 'FCAL', 'FCAP', 'FCBC', 'FCBP', 'FCCO', 'FCCY', 'FCEF', 'FCEL', 'FCFS', 'FCNCA', 'FCNCP', 'FCRD', 'FCVT', 'FDBC', 'FDIV', 'FDMT', 'FDNI', 'FDT', 'FDTS', 'FDUS', 'FDUSG', 'FDUSZ', 'FEIM', 'FELE', 'FEM', 'FEMB', 'FEMS', 'FENC', 'FEP', 'FEUZ', 'FEX', 'FEYE', 'FFBC', 'FFBW', 'FFHL', 'FFIC', 'FFIN', 'FFIV', 'FFNW', 'FFWM', 'FGBI', 'FGEN', 'FGF', 'FGFPP', 'FGM', 'FHB', 'FHTX', 'FIBK', 'FICS', 'FID', 'FIII', 'FIIIU', 'FIIIW', 'FINM', 'FINMU', 'FINMW', 'FINX', 'FISI', 'FISV', 'FITB', 'FITBI', 'FITBO', 'FITBP', 'FIVE', 'FIVN', 'FIXD', 'FIXX', 'FIZZ', 'FJP', 'FKU', 'FLAC', 'FLACU', 'FLACW', 'FLDM', 'FLEX', 'FLGT', 'FLIC', 'FLIR', 'FLL', 'FLMN', 'FLMNW', 'FLN', 'FLNT', 'FLUX', 'FLWS', 'FLXN', 'FLXS', 'FMAO', 'FMB', 'FMBH', 'FMBI', 'FMBIO', 'FMBIP', 'FMHI', 'FMNB', 'FMTX', 'FNCB', 'FNHC', 'FNK', 'FNKO', 'FNLC', 'FNWB', 'FNX', 'FNY', 'FOCS', 'FOLD', 'FONR', 'FORA', 'FORD', 'FOREU', 'FORM', 'FORR', 'FORTY', 'FOSL', 'FOX', 'FOXA', 'FOXF', 'FOXW', 'FOXWU', 'FOXWW', 'FPA', 'FPAY', 'FPRX', 'FPXE', 'FPXI', 'FRAF', 'FRBA', 'FRBK', 'FREE', 'FREEW', 'FREQ', 'FRG', 'FRGAP', 'FRGI', 'FRHC', 'FRLN', 'FRME', 'FROG', 'FRONU', 'FRPH', 'FRPT', 'FRSGU', 'FRSX', 'FRTA', 'FRWAU', 'FSBW', 'FSEA', 'FSFG', 'FSII', 'FSLR', 'FSRV', 'FSRVU', 'FSRVW', 'FSRXU', 'FSSIU', 'FSTR', 'FSTX', 'FSV', 'FSZ', 'FTA', 'FTAAU', 'FTAG', 'FTC', 'FTCS', 'FTCV', 'FTCVU', 'FTCVW', 'FTDR', 'FTEK', 'FTFT', 'FTGC', 'FTHI', 'FTHM', 'FTIV', 'FTIVU', 'FTIVW', 'FTLB', 'FTNT', 'FTOC', 'FTOCU', 'FTOCW', 'FTPAU', 'FTRI', 'FTSL', 'FTSM', 'FTXD', 'FTXG', 'FTXH', 'FTXL', 'FTXN', 'FTXO', 'FTXR', 'FULC', 'FULT', 'FULTP', 'FUNC', 'FUND', 'FUSB', 'FUSN', 'FUTU', 'FUV', 'FV', 'FVAM', 'FVC', 'FVCB', 'FVE', 'FWAA', 'FWONA', 'FWONK', 'FWP', 'FWRD', 'FXNC', 'FYC', 'FYT', 'FYX', 'GABC', 'GAIA', 'GAIN', 'GAINL', 'GAINN', 'GALT', 'GAN', 'GASS', 'GBCI', 'GBDC', 'GBIO', 'GBLI', 'GBLIL', 'GBNY', 'GBOX', 'GBRGU', 'GBS', 'GBT', 'GCACU', 'GCBC', 'GCMG', 'GCMGW', 'GDEN', 'GDRX', 'GDS', 'GDYN', 'GDYNW', 'GECC', 'GECCL', 'GECCM', 'GECCN', 'GEG', 'GENC', 'GENE', 'GENY', 'GEOS', 'GERN', 'GEVO', 'GFED', 'GFN', 'GFNCP', 'GFNSZ', 'GGAL', 'GH', 'GHACU', 'GHSI', 'GHVI', 'GHVIU', 'GHVIW', 'GIFI', 'GIGE', 'GIGGU', 'GIGM', 'GIII', 'GIIXU', 'GILD', 'GILT', 'GLAD', 'GLADL', 'GLAQ', 'GLAQU', 'GLAQW', 'GLBLU', 'GLBS', 'GLBZ', 'GLDD', 'GLDI', 'GLG', 'GLMD', 'GLNG', 'GLPG', 'GLPI', 'GLRE', 'GLSI', 'GLTO', 'GLUU', 'GLYC', 'GMAB', 'GMBL', 'GMBLW', 'GMBT', 'GMBTU', 'GMBTW', 'GMDA', 'GMII', 'GMIIU', 'GMIIW', 'GMLP', 'GMLPP', 'GMTX', 'GNAC', 'GNACU', 'GNACW', 'GNCA', 'GNFT', 'GNLN', 'GNMA', 'GNMK', 'GNOG', 'GNOM', 'GNPX', 'GNRS', 'GNRSU', 'GNRSW', 'GNSS', 'GNTX', 'GNTY', 'GNUS', 'GO', 'GOCO', 'GOEV', 'GOEVW', 'GOGL', 'GOGO', 'GOOD', 'GOODM', 'GOODN', 'GOOG', 'GOOGL', 'GOSS', 'GOVX', 'GOVXW', 'GP', 'GPAC', 'GPACU', 'GPACW', 'GPP', 'GPRE', 'GPRO', 'GRAY', 'GRBK', 'GRCL', 'GRCY', 'GRCYU', 'GRCYW', 'GRFS', 'GRID', 'GRIL', 'GRIN', 'GRMN', 'GRNQ', 'GRNV', 'GRNVR', 'GRNVU', 'GRNVW', 'GROW', 'GRPN', 'GRSV', 'GRSVU', 'GRSVW', 'GRTS', 'GRTX', 'GRVY', 'GRWG', 'GSAQ', 'GSAQU', 'GSAQW', 'GSBC', 'GSEVU', 'GSHD', 'GSIT', 'GSKY', 'GSM', 'GSMG', 'GSMGW', 'GSUM', 'GT', 'GTBP', 'GTEC', 'GTH', 'GTHX', 'GTIM', 'GTPAU', 'GTPBU', 'GTYH', 'GURE', 'GVP', 'GWAC', 'GWACW', 'GWGH', 'GWPH', 'GWRS', 'GXGX', 'GXGXU', 'GXGXW', 'GXTG', 'GYRO', 'HA', 'HAAC', 'HAACU', 'HAACW', 'HAFC', 'HAIN', 'HALL', 'HALO', 'HAPP', 'HARP', 'HAS', 'HAYN', 'HBAN', 'HBANN', 'HBANO', 'HBANP', 'HBCP', 'HBIO', 'HBMD', 'HBNC', 'HBP', 'HBT', 'HCAP', 'HCAPZ', 'HCAQ', 'HCAR', 'HCARU', 'HCARW', 'HCAT', 'HCCC', 'HCCCU', 'HCCCW', 'HCCI', 'HCDI', 'HCIC', 'HCICU', 'HCICW', 'HCIIU', 'HCKT', 'HCM', 'HCSG', 'HDSN', 'HEAR', 'HEC', 'HECCU', 'HECCW', 'HEES', 'HELE', 'HEPA', 'HERAU', 'HERD', 'HERO', 'HEWG', 'HFBL', 'HFFG', 'HFWA', 'HGBL', 'HGEN', 'HGSH', 'HHR', 'HIBB', 'HIFS', 'HIHO', 'HIIIU', 'HIMX', 'HJLI', 'HJLIW', 'HLAH', 'HLAHU', 'HLAHW', 'HLAL', 'HLG', 'HLIO', 'HLIT', 'HLNE', 'HLXA', 'HMCO', 'HMCOU', 'HMCOW', 'HMHC', 'HMNF', 'HMPT', 'HMST', 'HMSY', 'HMTV', 'HNDL', 'HNNA', 'HNRG', 'HOFT', 'HOFV', 'HOFVW', 'HOL', 'HOLI', 'HOLUU', 'HOLUW', 'HOLX', 'HOMB', 'HONE', 'HOOK', 'HOPE', 'HOTH', 'HOVNP', 'HPK', 'HPKEW', 'HQI', 'HQY', 'HRMY', 'HROW', 'HRTX', 'HRZN', 'HSAQ', 'HSDT', 'HSIC', 'HSII', 'HSKA', 'HSON', 'HST', 'HSTM', 'HSTO', 'HTBI', 'HTBK', 'HTBX', 'HTGM', 'HTHT', 'HTIA', 'HTLD', 'HTLF', 'HTLFP', 'HTOO', 'HTOOW', 'HUBG', 'HUDI', 'HUGE', 'HUIZ', 'HURC', 'HURN', 'HUSN', 'HVBC', 'HWBK', 'HWC', 'HWCC', 'HWCPL', 'HWCPZ', 'HWKN', 'HX', 'HYACU', 'HYFM', 'HYLS', 'HYMC', 'HYMCL', 'HYMCW', 'HYMCZ', 'HYRE', 'HYXF', 'HYZD', 'HZNP', 'IAC', 'IART', 'IBB', 'IBBJ', 'IBCP', 'IBEX', 'IBKR', 'IBOC', 'IBRX', 'IBTA', 'IBTB', 'IBTD', 'IBTE', 'IBTF', 'IBTG', 'IBTH', 'IBTI', 'IBTJ', 'IBTK', 'IBTX', 'ICAD', 'ICBK', 'ICCC', 'ICCH', 'ICFI', 'ICHR', 'ICLK', 'ICLN', 'ICLR', 'ICMB', 'ICON', 'ICPT', 'ICUI', 'IDBA', 'IDCC', 'IDEX', 'IDLB', 'IDN', 'IDRA', 'IDXX', 'IDYA', 'IEA', 'IEAWW', 'IEC', 'IEF', 'IEI', 'IEP', 'IESC', 'IEUS', 'IFGL', 'IFMK', 'IFRX', 'IFV', 'IGAC', 'IGACU', 'IGACW', 'IGF', 'IGIB', 'IGIC', 'IGICW', 'IGMS', 'IGNY', 'IGNYU', 'IGNYW', 'IGOV', 'IGSB', 'IHRT', 'IHYF', 'III', 'IIII', 'IIIIU', 'IIIIW', 'IIIN', 'IIIV', 'IIN', 'IIVI', 'IIVIP', 'IJT', 'IKNX', 'IKT', 'ILMN', 'ILPT', 'IMAB', 'IMAC', 'IMACW', 'IMBI', 'IMCC', 'IMCR', 'IMGN', 'IMKTA', 'IMMP', 'IMMR', 'IMNM', 'IMOS', 'IMRA', 'IMRN', 'IMRNW', 'IMTE', 'IMTX', 'IMTXW', 'IMUX', 'IMV', 'IMVT', 'IMXI', 'INBK', 'INBKL', 'INBKZ', 'INBX', 'INCY', 'INDB', 'INDT', 'INDY', 'INFI', 'INFN', 'INFR', 'INGN', 'INKA', 'INKAU', 'INKAW', 'INM', 'INMB', 'INMD', 'INNV', 'INO', 'INOD', 'INOV', 'INPX', 'INSE', 'INSG', 'INSM', 'INTC', 'INTG', 'INTU', 'INTZ', 'INVA', 'INVE', 'INVO', 'INZY', 'IONS', 'IOSP', 'IOVA', 'IPA', 'IPAR', 'IPDN', 'IPGP', 'IPHA', 'IPHI', 'IPKW', 'IPLDP', 'IPVIU', 'IPWR', 'IQ', 'IRBT', 'IRCP', 'IRDM', 'IRIX', 'IRMD', 'IROQ', 'IRTC', 'IRWD', 'ISBC', 'ISDX', 'ISEE', 'ISEM', 'ISHG', 'ISIG', 'ISLEU', 'ISNS', 'ISRG', 'ISSC', 'ISTB', 'ISTR', 'ISUN', 'ITAC', 'ITACU', 'ITACW', 'ITCI', 'ITHXU', 'ITI', 'ITIC', 'ITMR', 'ITOS', 'ITQRU', 'ITRI', 'ITRM', 'ITRN', 'IUS', 'IUSB', 'IUSG', 'IUSS', 'IUSV', 'IVA', 'IVAC', 'IXUS', 'IZEA', 'JACK', 'JAGX', 'JAKK', 'JAMF', 'JAN', 'JAZZ', 'JBHT', 'JBLU', 'JBSS', 'JCIC', 'JCICU', 'JCICW', 'JCOM', 'JCS', 'JCTCF', 'JD', 'JFIN', 'JFU', 'JG', 'JJSF', 'JKHY', 'JKI', 'JMPNL', 'JMPNZ', 'JNCE', 'JOAN', 'JOBS', 'JOET', 'JOFFU', 'JOUT', 'JRJC', 'JRSH', 'JRVR', 'JSM', 'JSMD', 'JSML', 'JUPW', 'JUPWW', 'JVA', 'JYAC', 'JYNT', 'KAIIU', 'KAIR', 'KAIRU', 'KAIRW', 'KALA', 'KALU', 'KALV', 'KBAL', 'KBNT', 'KBNTW', 'KBSF', 'KBWB', 'KBWD', 'KBWP', 'KBWR', 'KBWY', 'KC', 'KCAPL', 'KDMN', 'KDNY', 'KDP', 'KE', 'KEJI', 'KELYA', 'KELYB', 'KEQU', 'KERN', 'KERNW', 'KFFB', 'KFRC', 'KHC', 'KIDS', 'KIIIU', 'KIN', 'KINS', 'KINZ', 'KINZU', 'KINZW', 'KIRK', 'KLAC', 'KLAQ', 'KLAQU', 'KLAQW', 'KLDO', 'KLIC', 'KLXE', 'KMDA', 'KMPH', 'KNDI', 'KNSA', 'KNSL', 'KNTE', 'KOD', 'KOPN', 'KOR', 'KOSS', 'KPTI', 'KRBP', 'KRKR', 'KRMA', 'KRMD', 'KRNLU', 'KRNT', 'KRNY', 'KRON', 'KROS', 'KRTX', 'KRUS', 'KRYS', 'KSMT', 'KSMTU', 'KSMTW', 'KSPN', 'KTCC', 'KTOS', 'KTRA', 'KURA', 'KURIU', 'KVHI', 'KVSA', 'KXIN', 'KYMR', 'KZIA', 'KZR', 'LABP', 'LACQ', 'LACQU', 'LACQW', 'LAKE', 'LAMR', 'LANC', 'LAND', 'LANDM', 'LANDO', 'LARK', 'LASR', 'LATN', 'LATNU', 'LATNW', 'LAUR', 'LAWS', 'LAZR', 'LAZY', 'LBAI', 'LBC', 'LBPH', 'LBRDA', 'LBRDK', 'LBRDP', 'LBTYA', 'LBTYB', 'LBTYK', 'LCAAU', 'LCAP', 'LCAPU', 'LCAPW', 'LCNB', 'LCUT', 'LCY', 'LCYAU', 'LCYAW', 'LDEM', 'LDSF', 'LE', 'LECO', 'LEDS', 'LEGH', 'LEGN', 'LEGO', 'LEGOU', 'LEGOW', 'LEGR', 'LESL', 'LEVL', 'LEVLP', 'LEXX', 'LEXXW', 'LFMD', 'LFTR', 'LFTRU', 'LFTRW', 'LFUS', 'LFVN', 'LGACU', 'LGHL', 'LGHLW', 'LGIH', 'LGND', 'LGVN', 'LHAA', 'LHCG', 'LHDX', 'LI', 'LIFE', 'LILA', 'LILAK', 'LINC', 'LIND', 'LIQT', 'LITE', 'LIVE', 'LIVK', 'LIVKU', 'LIVKW', 'LIVN', 'LIVX', 'LIXT', 'LIXTW', 'LIZI', 'LJAQ', 'LJAQU', 'LJAQW', 'LJPC', 'LKCO', 'LKFN', 'LKQ', 'LLIT', 'LLNW', 'LMACA', 'LMACU', 'LMACW', 'LMAOU', 'LMAT', 'LMB', 'LMBS', 'LMFA', 'LMNL', 'LMNR', 'LMNX', 'LMPX', 'LMRK', 'LMRKN', 'LMRKO', 'LMRKP', 'LMST', 'LNDC', 'LNGR', 'LNSR', 'LNT', 'LNTH', 'LOAC', 'LOACR', 'LOACU', 'LOACW', 'LOAN', 'LOB', 'LOCO', 'LOGC', 'LOGI', 'LOOP', 'LOPE', 'LORL', 'LOTZ', 'LOTZW', 'LOVE', 'LPCN', 'LPLA', 'LPRO', 'LPSN', 'LPTH', 'LPTX', 'LQDA', 'LQDT', 'LRCX', 'LRGE', 'LRMR', 'LSAQ', 'LSBK', 'LSCC', 'LSEA', 'LSEAW', 'LSTR', 'LSXMA', 'LSXMB', 'LSXMK', 'LTBR', 'LTRN', 'LTRPA', 'LTRPB', 'LTRX', 'LULU', 'LUMO', 'LUNA', 'LUNG', 'LUXA', 'LUXAU', 'LUXAW', 'LVHD', 'LWAC', 'LWACU', 'LWACW', 'LWAY', 'LX', 'LXEH', 'LXRX', 'LYFT', 'LYL', 'LYRA', 'LYTS', 'MAAC', 'MAACU', 'MAACW', 'MACAU', 'MACK', 'MACQU', 'MACU', 'MACUU', 'MACUW', 'MAGS', 'MANH', 'MANT', 'MAR', 'MARA', 'MARK', 'MARPS', 'MASI', 'MASS', 'MAT', 'MATW', 'MAXN', 'MAYS', 'MBB', 'MBCN', 'MBII', 'MBIN', 'MBINO', 'MBINP', 'MBIO', 'MBNKP', 'MBOT', 'MBRX', 'MBUU', 'MBWM', 'MCAD', 'MCADR', 'MCADU', 'MCBC', 'MCBS', 'MCEF', 'MCFE', 'MCFT', 'MCHI', 'MCHP', 'MCHX', 'MCMJ', 'MCMJW', 'MCRB', 'MCRI', 'MDB', 'MDCA', 'MDGL', 'MDGS', 'MDGSW', 'MDIA', 'MDIV', 'MDJH', 'MDLZ', 'MDNA', 'MDRR', 'MDRRP', 'MDRX', 'MDVL', 'MDWD', 'MDWT', 'MDXG', 'MEDP', 'MEDS', 'MEIP', 'MELI', 'MEOH', 'MERC', 'MESA', 'MESO', 'METC', 'METX', 'METXW', 'MFH', 'MFIN', 'MFINL', 'MFNC', 'MGEE', 'MGI', 'MGIC', 'MGLN', 'MGNI', 'MGNX', 'MGPI', 'MGRC', 'MGTA', 'MGTX', 'MGYR', 'MHLD', 'MICT', 'MIDD', 'MIK', 'MILE', 'MILEW', 'MILN', 'MIME', 'MIND', 'MINDP', 'MIRM', 'MIST', 'MITC', 'MITK', 'MITO', 'MKD', 'MKGI', 'MKSI', 'MKTX', 'MLAB', 'MLAC', 'MLACU', 'MLACW', 'MLCO', 'MLHR', 'MLND', 'MLVF', 'MMAC', 'MMLP', 'MMSI', 'MMYT', 'MNDO', 'MNKD', 'MNOV', 'MNPR', 'MNRO', 'MNSB', 'MNSBP', 'MNST', 'MNTK', 'MNTX', 'MODV', 'MOFG', 'MOGO', 'MOHO', 'MOMO', 'MON', 'MONCU', 'MONCW', 'MOR', 'MORF', 'MORN', 'MOSY', 'MOTN', 'MOTNU', 'MOTNW', 'MOTS', 'MOXC', 'MPAA', 'MPB', 'MPWR', 'MRAC', 'MRACU', 'MRACW', 'MRAM', 'MRBK', 'MRCC', 'MRCY', 'MREO', 'MRIN', 'MRKR', 'MRLN', 'MRM', 'MRNA', 'MRNS', 'MRSN', 'MRTN', 'MRTX', 'MRUS', 'MRVI', 'MRVL', 'MSACU', 'MSBI', 'MSEX', 'MSFT', 'MSGM', 'MSON', 'MSTR', 'MSVB', 'MTAC', 'MTACU', 'MTACW', 'MTBC', 'MTBCP', 'MTC', 'MTCH', 'MTCR', 'MTEM', 'MTEX', 'MTLS', 'MTP', 'MTRX', 'MTSC', 'MTSI', 'MTSL', 'MU', 'MUDS', 'MUDSU', 'MUDSW', 'MVBF', 'MVIS', 'MWK', 'MXIM', 'MYFW', 'MYGN', 'MYRG', 'MYSZ', 'MYT', 'NAAC', 'NAACU', 'NAACW', 'NAII', 'NAKD', 'NAOV', 'NARI', 'NATH', 'NATI', 'NATR', 'NAVI', 'NBAC', 'NBACR', 'NBACU', 'NBACW', 'NBEV', 'NBIX', 'NBLX', 'NBN', 'NBRV', 'NBSE', 'NBTB', 'NBTX', 'NCBS', 'NCMI', 'NCNA', 'NCNO', 'NCSM', 'NCTY', 'NDACU', 'NDAQ', 'NDLS', 'NDRA', 'NDRAW', 'NDSN', 'NEBC', 'NEBCU', 'NEBCW', 'NEO', 'NEOG', 'NEON', 'NEOS', 'NEPH', 'NEPT', 'NERV', 'NESR', 'NESRW', 'NETE', 'NEWA', 'NEWT', 'NEWTL', 'NEWTZ', 'NEXI', 'NEXT', 'NFBK', 'NFE', 'NFLX', 'NFTY', 'NGAC', 'NGACU', 'NGACW', 'NGM', 'NGMS', 'NH', 'NHIC', 'NHICU', 'NHICW', 'NHTC', 'NICE', 'NICK', 'NISN', 'NIU', 'NKLA', 'NKSH', 'NKTR', 'NKTX', 'NLOK', 'NLSP', 'NLSPW', 'NLTX', 'NMCI', 'NMFC', 'NMIH', 'NMMC', 'NMMCU', 'NMMCW', 'NMRD', 'NMRK', 'NMTR', 'NNBR', 'NNDM', 'NNOX', 'NOAC', 'NOACU', 'NOACW', 'NODK', 'NOVN', 'NOVT', 'NPA', 'NPAUU', 'NPAWW', 'NRACU', 'NRBO', 'NRC', 'NRIM', 'NRIX', 'NSEC', 'NSIT', 'NSSC', 'NSTG', 'NSYS', 'NTAP', 'NTCT', 'NTEC', 'NTES', 'NTGR', 'NTIC', 'NTLA', 'NTNX', 'NTRA', 'NTRS', 'NTRSO', 'NTUS', 'NTWK', 'NUAN', 'NURO', 'NUVA', 'NUZE', 'NVAX', 'NVCN', 'NVCR', 'NVDA', 'NVEC', 'NVEE', 'NVFY', 'NVIV', 'NVMI', 'NVOS', 'NVSAU', 'NWBI', 'NWE', 'NWFL', 'NWL', 'NWLI', 'NWPX', 'NWS', 'NWSA', 'NXGN', 'NXPI', 'NXST', 'NXTC', 'NXTD', 'NXTG', 'NYMT', 'NYMTM', 'NYMTN', 'NYMTO', 'NYMTP', 'NYMX', 'OAS', 'OBAS', 'OBCI', 'OBLG', 'OBLN', 'OBNK', 'OBSV', 'OCAX', 'OCAXU', 'OCAXW', 'OCC', 'OCCI', 'OCCIP', 'OCDX', 'OCFC', 'OCFCP', 'OCG', 'OCGN', 'OCSI', 'OCSL', 'OCUL', 'OCUP', 'OCX', 'ODFL', 'ODP', 'ODT', 'OEG', 'OEPW', 'OEPWU', 'OEPWW', 'OESX', 'OFED', 'OFIX', 'OFLX', 'OFS', 'OFSSG', 'OFSSI', 'OGI', 'OHPAU', 'OIIM', 'OKTA', 'OLB', 'OLD', 'OLED', 'OLLI', 'OLMA', 'OM', 'OMAB', 'OMCL', 'OMEG', 'OMER', 'OMEX', 'OMP', 'ON', 'ONB', 'ONCR', 'ONCS', 'ONCT', 'ONCY', 'ONDS', 'ONEM', 'ONEQ', 'ONEW', 'ONTX', 'ONTXW', 'ONVO', 'OPBK', 'OPCH', 'OPEN', 'OPENW', 'OPGN', 'OPHC', 'OPI', 'OPINI', 'OPINL', 'OPK', 'OPNT', 'OPOF', 'OPRA', 'OPRT', 'OPRX', 'OPT', 'OPTN', 'OPTT', 'ORBC', 'ORGO', 'ORGS', 'ORIC', 'ORLY', 'ORMP', 'ORPH', 'ORRF', 'ORTX', 'OSBC', 'OSIS', 'OSMT', 'OSN', 'OSPN', 'OSS', 'OSTK', 'OSTR', 'OSTRU', 'OSTRW', 'OSUR', 'OSW', 'OTEL', 'OTEX', 'OTIC', 'OTLK', 'OTLKW', 'OTRA', 'OTRAU', 'OTRAW', 'OTRK', 'OTRKP', 'OTTR', 'OVBC', 'OVID', 'OVLY', 'OXBR', 'OXBRW', 'OXLC', 'OXLCM', 'OXLCO', 'OXLCP', 'OXSQ', 'OXSQL', 'OXSQZ', 'OYST', 'OZK', 'OZON', 'PAA', 'PAAS', 'PACB', 'PACW', 'PACX', 'PACXU', 'PACXW', 'PAE', 'PAEWW', 'PAGP', 'PAHC', 'PAIC', 'PAICU', 'PAICW', 'PAND', 'PANL', 'PAQC', 'PAQCU', 'PAQCW', 'PASG', 'PATI', 'PATK', 'PAVM', 'PAVMW', 'PAVMZ', 'PAX', 'PAYA', 'PAYAW', 'PAYS', 'PAYX', 'PBCT', 'PBCTP', 'PBFS', 'PBHC', 'PBIP', 'PBLA', 'PBPB', 'PBTS', 'PBYI', 'PCAR', 'PCB', 'PCH', 'PCOM', 'PCRX', 'PCSA', 'PCSB', 'PCTI', 'PCTY', 'PCVX', 'PCYG', 'PCYO', 'PDBC', 'PDCE', 'PDCO', 'PDD', 'PDEV', 'PDEX', 'PDFS', 'PDLB', 'PDP', 'PDSB', 'PEBK', 'PEBO', 'PEGA', 'PENN', 'PEP', 'PERI', 'PESI', 'PETQ', 'PETS', 'PETZ', 'PEY', 'PEZ', 'PFBC', 'PFBI', 'PFC', 'PFDRU', 'PFF', 'PFG', 'PFHD', 'PFI', 'PFIE', 'PFIN', 'PFIS', 'PFLT', 'PFM', 'PFMT', 'PFPT', 'PFSW', 'PFX', 'PFXNL', 'PGC', 'PGEN', 'PGJ', 'PGNY', 'PGRWU', 'PHAR', 'PHAS', 'PHAT', 'PHCF', 'PHIC', 'PHICU', 'PHICW', 'PHIO', 'PHIOW', 'PHO', 'PHUN', 'PHUNW', 'PHVS', 'PI', 'PID', 'PIE', 'PINC', 'PIO', 'PIRS', 'PIXY', 'PIZ', 'PKBK', 'PKOH', 'PKW', 'PLAB', 'PLAY', 'PLBC', 'PLBY', 'PLCE', 'PLIN', 'PLL', 'PLMR', 'PLPC', 'PLRX', 'PLSE', 'PLTK', 'PLUG', 'PLUS', 'PLW', 'PLXP', 'PLXS', 'PLYA', 'PMBC', 'PMD', 'PME', 'PMGMU', 'PMVP', 'PNBK', 'PNFP', 'PNFPP', 'PNNT', 'PNNTG', 'PNQI', 'PNRG', 'PNTG', 'POAI', 'PODD', 'POLA', 'POOL', 'POSH', 'POTX', 'POW', 'POWI', 'POWL', 'POWRU', 'POWRW', 'POWW', 'PPBI', 'PPBT', 'PPC', 'PPD', 'PPGH', 'PPGHU', 'PPGHW', 'PPH', 'PPIH', 'PPSI', 'PPTA', 'PRAA', 'PRAH', 'PRAX', 'PRCH', 'PRCHW', 'PRDO', 'PRFT', 'PRFX', 'PRFZ', 'PRGS', 'PRIM', 'PRLD', 'PRN', 'PROF', 'PROG', 'PROV', 'PRPH', 'PRPL', 'PRPO', 'PRQR', 'PRSR', 'PRSRU', 'PRSRW', 'PRTA', 'PRTC', 'PRTG', 'PRTH', 'PRTK', 'PRTS', 'PRVB', 'PS', 'PSAC', 'PSACU', 'PSACW', 'PSAGU', 'PSC', 'PSCC', 'PSCD', 'PSCE', 'PSCF', 'PSCH', 'PSCI', 'PSCM', 'PSCT', 'PSCU', 'PSEC', 'PSET', 'PSHG', 'PSL', 'PSMT', 'PSNL', 'PSTI', 'PSTV', 'PSTX', 'PT', 'PTC', 'PTCT', 'PTE', 'PTEN', 'PTF', 'PTGX', 'PTH', 'PTIC', 'PTICU', 'PTICW', 'PTMN', 'PTNR', 'PTOCU', 'PTON', 'PTPI', 'PTRS', 'PTSI', 'PTVCA', 'PTVCB', 'PTVE', 'PUBM', 'PUCKU', 'PUI', 'PULM', 'PUYI', 'PVAC', 'PVBC', 'PWFL', 'PWOD', 'PXI', 'PXLW', 'PXS', 'PXSAP', 'PXSAW', 'PY', 'PYPD', 'PYPL', 'PYR', 'PYZ', 'PZZA', 'QABA', 'QADA', 'QADB', 'QAT', 'QCLN', 'QCOM', 'QCRH', 'QDEL', 'QELL', 'QELLU', 'QELLW', 'QFIN', 'QH', 'QIWI', 'QK', 'QLGN', 'QLI', 'QLYS', 'QMCO', 'QNST', 'QQC', 'QQD', 'QQEW', 'QQQ', 'QQQJ', 'QQQM', 'QQQN', 'QQQX', 'QQXT', 'QRHC', 'QRTEA', 'QRTEB', 'QRTEP', 'QRVO', 'QTEC', 'QTNT', 'QTRX', 'QTT', 'QUIK', 'QUMU', 'QURE', 'QYLD', 'QYLG', 'RAAC', 'RAACU', 'RAACW', 'RACA', 'RADA', 'RADI', 'RAIL', 'RAND', 'RAPT', 'RARE', 'RAVE', 'RAVN', 'RBB', 'RBBN', 'RBCAA', 'RBCN', 'RBKB', 'RBNC', 'RCEL', 'RCHG', 'RCHGU', 'RCHGW', 'RCII', 'RCKT', 'RCKY', 'RCLFU', 'RCM', 'RCMT', 'RCON', 'RDCM', 'RDFN', 'RDHL', 'RDI', 'RDIB', 'RDNT', 'RDUS', 'RDVT', 'RDVY', 'RDWR', 'REAL', 'REDU', 'REED', 'REFR', 'REG', 'REGI', 'REGN', 'REIT', 'REKR', 'RELI', 'RELIW', 'RELL', 'REPH', 'REPL', 'RESN', 'RETA', 'RETO', 'REYN', 'RFAP', 'RFDI', 'RFEM', 'RFEU', 'RFIL', 'RGCO', 'RGEN', 'RGLD', 'RGLS', 'RGNX', 'RGP', 'RIBT', 'RICK', 'RIDE', 'RIGL', 'RILY', 'RILYG', 'RILYH', 'RILYI', 'RILYL', 'RILYM', 'RILYN', 'RILYO', 'RILYP', 'RILYT', 'RILYZ', 'RING', 'RIOT', 'RIVE', 'RKDA', 'RLAY', 'RLMD', 'RMBI', 'RMBL', 'RMBS', 'RMCF', 'RMGB', 'RMGBU', 'RMGBW', 'RMGCU', 'RMNI', 'RMR', 'RMRM', 'RMTI', 'RNA', 'RNDB', 'RNDM', 'RNDV', 'RNEM', 'RNET', 'RNLC', 'RNLX', 'RNMC', 'RNRG', 'RNSC', 'RNST', 'RNWK', 'ROAD', 'ROBT', 'ROCC', 'ROCCU', 'ROCCW', 'ROCH', 'ROCHU', 'ROCHW', 'ROCK', 'ROCRU', 'ROIC', 'ROKU', 'ROLL', 'ROOT', 'ROST', 'RP', 'RPAY', 'RPD', 'RPRX', 'RPTX', 'RRBI', 'RRGB', 'RRR', 'RSSS', 'RSVA', 'RSVAU', 'RSVAW', 'RTH', 'RTLR', 'RUBY', 'RUHN', 'RUN', 'RUSHA', 'RUSHB', 'RUTH', 'RVMD', 'RVNC', 'RVPH', 'RVPHW', 'RVSB', 'RWLK', 'RXDX', 'RXRAU', 'RXT', 'RYAAY', 'RYTM', 'RZLT', 'SABR', 'SABRP', 'SAFM', 'SAFT', 'SAGE', 'SAIA', 'SAII', 'SAIIU', 'SAIIW', 'SAL', 'SALM', 'SAMG', 'SANA', 'SANM', 'SANW', 'SASR', 'SATS', 'SAVA', 'SBAC', 'SBBP', 'SBCF', 'SBEAU', 'SBFG', 'SBGI', 'SBLK', 'SBLKZ', 'SBNY', 'SBNYP', 'SBRA', 'SBSI', 'SBT', 'SBTX', 'SBUX', 'SCAQU', 'SCHL', 'SCHN', 'SCKT', 'SCLEU', 'SCOA', 'SCOAU', 'SCOAW', 'SCOBU', 'SCOR', 'SCPH', 'SCPL', 'SCPS', 'SCR', 'SCSC', 'SCVL', 'SCWX', 'SCYX', 'SCZ', 'SDACU', 'SDC', 'SDG', 'SDGR', 'SDH', 'SDVY', 'SEAC', 'SECO', 'SEDG', 'SEED', 'SEEL', 'SEER', 'SEIC', 'SELB', 'SELF', 'SENEA', 'SENEB', 'SESN', 'SFBC', 'SFBS', 'SFET', 'SFIX', 'SFM', 'SFNC', 'SFST', 'SFT', 'SGA', 'SGAM', 'SGAMU', 'SGAMW', 'SGBX', 'SGC', 'SGEN', 'SGH', 'SGLB', 'SGLBW', 'SGMA', 'SGMO', 'SGMS', 'SGOC', 'SGRP', 'SGRY', 'SGTX', 'SHAC', 'SHACU', 'SHACW', 'SHBI', 'SHC', 'SHEN', 'SHIP', 'SHIPW', 'SHIPZ', 'SHLD', 'SHLS', 'SHOO', 'SHSP', 'SHV', 'SHY', 'SHYF', 'SIBN', 'SIC', 'SIEB', 'SIEN', 'SIFY', 'SIGA', 'SIGI', 'SIGIP', 'SILC', 'SILK', 'SIMO', 'SINA', 'SINO', 'SINT', 'SIOX', 'SIRI', 'SITM', 'SIVB', 'SIVBP', 'SJ', 'SKOR', 'SKYU', 'SKYW', 'SKYY', 'SLAB', 'SLAMU', 'SLCR', 'SLCRU', 'SLCRW', 'SLCT', 'SLDB', 'SLGG', 'SLGL', 'SLGN', 'SLM', 'SLMBP', 'SLN', 'SLNO', 'SLP', 'SLQD', 'SLRC', 'SLRX', 'SLS', 'SLVO', 'SMBC', 'SMBK', 'SMCI', 'SMCP', 'SMED', 'SMH', 'SMID', 'SMIT', 'SMMF', 'SMMT', 'SMPL', 'SMSI', 'SMTC', 'SMTI', 'SMTX', 'SNBR', 'SNCA', 'SNCR', 'SND', 'SNDE', 'SNDL', 'SNDX', 'SNES', 'SNEX', 'SNFCA', 'SNGX', 'SNGXW', 'SNLN', 'SNOA', 'SNPS', 'SNRH', 'SNRHU', 'SNRHW', 'SNSE', 'SNSR', 'SNUG', 'SNY', 'SOCL', 'SOHO', 'SOHOB', 'SOHON', 'SOHOO', 'SOHU', 'SOLO', 'SOLOW', 'SOLY', 'SONA', 'SONM', 'SONN', 'SONO', 'SOXX', 'SP', 'SPCB', 'SPFI', 'SPI', 'SPKBU', 'SPKE', 'SPKEP', 'SPLK', 'SPNE', 'SPNS', 'SPOK', 'SPPI', 'SPQQ', 'SPRB', 'SPRO', 'SPRT', 'SPSC', 'SPT', 'SPTKU', 'SPTN', 'SPWH', 'SPWR', 'SQBG', 'SQFT', 'SQLV', 'SQQQ', 'SRAC', 'SRACU', 'SRACW', 'SRAX', 'SRCE', 'SRCL', 'SRDX', 'SRET', 'SREV', 'SRGA', 'SRNE', 'SRNGU', 'SRPT', 'SRRA', 'SRRK', 'SRSA', 'SRSAU', 'SRSAW', 'SRTS', 'SSAAU', 'SSB', 'SSBI', 'SSKN', 'SSNC', 'SSNT', 'SSP', 'SSPK', 'SSPKU', 'SSPKW', 'SSRM', 'SSSS', 'SSTI', 'SSYS', 'STAA', 'STAF', 'STAY', 'STBA', 'STCN', 'STEP', 'STFC', 'STIM', 'STKL', 'STKS', 'STLD', 'STMP', 'STND', 'STNE', 'STOK', 'STRA', 'STRL', 'STRM', 'STRO', 'STRR', 'STRRP', 'STRS', 'STRT', 'STSA', 'STTK', 'STWO', 'STWOU', 'STWOW', 'STX', 'STXB', 'SUMO', 'SUMR', 'SUNS', 'SUNW', 'SUPN', 'SURF', 'SUSB', 'SUSC', 'SUSL', 'SV', 'SVA', 'SVAC', 'SVACU', 'SVACW', 'SVBI', 'SVC', 'SVFA', 'SVFAU', 'SVFAW', 'SVFB', 'SVFC', 'SVMK', 'SVOK', 'SVOKU', 'SVOKW', 'SVRA', 'SVSVU', 'SVSVW', 'SVVC', 'SWAV', 'SWBI', 'SWET', 'SWETU', 'SWETW', 'SWIR', 'SWKH', 'SWKS', 'SWTX', 'SXTC', 'SY', 'SYBT', 'SYBX', 'SYKE', 'SYNA', 'SYNC', 'SYNH', 'SYNL', 'SYPR', 'SYRS', 'SYTA', 'SYTAW', 'TA', 'TACO', 'TACT', 'TAIT', 'TANH', 'TANNI', 'TANNL', 'TANNZ', 'TAOP', 'TARA', 'TARS', 'TAST', 'TATT', 'TAYD', 'TBBK', 'TBCPU', 'TBIO', 'TBK', 'TBKCP', 'TBLT', 'TBLTW', 'TBNK', 'TBPH', 'TC', 'TCACU', 'TCBI', 'TCBIL', 'TCBIP', 'TCBK', 'TCDA', 'TCF', 'TCFC', 'TCFCP', 'TCMD', 'TCOM', 'TCON', 'TCPC', 'TCRR', 'TCX', 'TDAC', 'TDACU', 'TDACW', 'TDIV', 'TEAM', 'TECH', 'TECTP', 'TEDU', 'TEKK', 'TEKKU', 'TEKKW', 'TELA', 'TELL', 'TENB', 'TENX', 'TER', 'TERN', 'TESS', 'TFFP', 'TFSL', 'TGA', 'TGLS', 'TGTX', 'TH', 'THBR', 'THBRU', 'THBRW', 'THCA', 'THCAU', 'THCAW', 'THCB', 'THCBU', 'THCBW', 'THFF', 'THMAU', 'THMO', 'THRM', 'THRY', 'THTX', 'THWWW', 'TIG', 'TIGO', 'TIGR', 'TILE', 'TIPT', 'TIRX', 'TITN', 'TLC', 'TLGT', 'TLIS', 'TLMD', 'TLMDW', 'TLND', 'TLRY', 'TLS', 'TLSA', 'TLT', 'TMDI', 'TMDX', 'TMKR', 'TMKRU', 'TMKRW', 'TMPM', 'TMPMU', 'TMPMW', 'TMTS', 'TMTSU', 'TMTSW', 'TMUS', 'TNDM', 'TNXP', 'TOMZ', 'TOPS', 'TOUR', 'TOWN', 'TPCO', 'TPIC', 'TPTX', 'TQQQ', 'TRCH', 'TREE', 'TRHC', 'TRIB', 'TRIL', 'TRIN', 'TRIP', 'TRIT', 'TRITW', 'TRMB', 'TRMD', 'TRMK', 'TRMT', 'TRNS', 'TROW', 'TRS', 'TRST', 'TRUE', 'TRUP', 'TRVG', 'TRVI', 'TRVN', 'TSBK', 'TSC', 'TSCAP', 'TSCBP', 'TSCO', 'TSEM', 'TSHA', 'TSIA', 'TSIAU', 'TSIAW', 'TSIBU', 'TSLA', 'TSRI', 'TTCF', 'TTD', 'TTEC', 'TTEK', 'TTGT', 'TTMI', 'TTNP', 'TTOO', 'TTWO', 'TUR', 'TURN', 'TUSA', 'TUSK', 'TVAC', 'TVACU', 'TVACW', 'TVTX', 'TVTY', 'TW', 'TWCT', 'TWCTU', 'TWCTW', 'TWIN', 'TWLVU', 'TWNK', 'TWNKW', 'TWOU', 'TWST', 'TXG', 'TXMD', 'TXN', 'TXRH', 'TYHT', 'TYME', 'TZOO', 'TZPS', 'TZPSU', 'TZPSW', 'UAE', 'UAL', 'UBCP', 'UBFO', 'UBOH', 'UBSI', 'UBX', 'UCBI', 'UCBIO', 'UCL', 'UCTT', 'UCYB', 'UEIC', 'UEPS', 'UFCS', 'UFO', 'UFPI', 'UFPT', 'UG', 'UGRO', 'UHAL', 'UIHC', 'UK', 'UKOMW', 'ULBI', 'ULH', 'ULTA', 'UMBF', 'UMPQ', 'UNAM', 'UNB', 'UNIT', 'UNTY', 'UONE', 'UONEK', 'UPLD', 'UPST', 'UPWK', 'URBN', 'URGN', 'UROV', 'USAK', 'USAP', 'USAT', 'USAU', 'USCR', 'USEG', 'USIG', 'USIO', 'USLB', 'USLM', 'USMC', 'USOI', 'USWS', 'USWSW', 'USXF', 'UTHR', 'UTMD', 'UTSI', 'UVSP', 'UXIN', 'VACQ', 'VACQU', 'VACQW', 'VALU', 'VAQC', 'VBFC', 'VBIV', 'VBLT', 'VBTX', 'VC', 'VCEL', 'VCIT', 'VCKA', 'VCKAU', 'VCKAW', 'VCLT', 'VCNX', 'VCSH', 'VCTR', 'VCVC', 'VCVCU', 'VCVCW', 'VCYT', 'VECO', 'VELOU', 'VENAU', 'VEON', 'VERB', 'VERBW', 'VERI', 'VERO', 'VERU', 'VERX', 'VERY', 'VETS', 'VFF', 'VG', 'VGIT', 'VGLT', 'VGSH', 'VIAC', 'VIACA', 'VIAV', 'VICR', 'VIE', 'VIEW', 'VIEWW', 'VIGI', 'VIH', 'VIHAU', 'VIHAW', 'VII', 'VIIAU', 'VIIAW', 'VINC', 'VINCU', 'VINCW', 'VINO', 'VINP', 'VIOT', 'VIR', 'VIRC', 'VIRI', 'VIRT', 'VIRX', 'VISL', 'VITL', 'VIVE', 'VIVO', 'VJET', 'VKTX', 'VKTXW', 'VLDR', 'VLDRW', 'VLGEA', 'VLON', 'VLY', 'VLYPO', 'VLYPP', 'VMAC', 'VMACU', 'VMACW', 'VMAR', 'VMBS', 'VMD', 'VNDA', 'VNET', 'VNOM', 'VNQI', 'VOD', 'VONE', 'VONG', 'VONV', 'VOR', 'VOSO', 'VOSOU', 'VOSOW', 'VOXX', 'VPCBU', 'VPN', 'VRA', 'VRAY', 'VRCA', 'VRDN', 'VREX', 'VRIG', 'VRM', 'VRME', 'VRMEW', 'VRNA', 'VRNS', 'VRNT', 'VRPX', 'VRRM', 'VRSK', 'VRSN', 'VRTS', 'VRTX', 'VS', 'VSAT', 'VSDA', 'VSEC', 'VSMV', 'VSPR', 'VSPRU', 'VSPRW', 'VSSYW', 'VSTA', 'VSTM', 'VTAQ', 'VTAQR', 'VTAQU', 'VTAQW', 'VTC', 'VTGN', 'VTHR', 'VTIP', 'VTIQ', 'VTIQU', 'VTIQW', 'VTNR', 'VTRN', 'VTRS', 'VTRU', 'VTSI', 'VTVT', 'VTWG', 'VTWO', 'VTWV', 'VUZI', 'VVOS', 'VVPR', 'VWOB', 'VWTR', 'VXRT', 'VXUS', 'VYGR', 'VYMI', 'VYNE', 'WABC', 'WAFD', 'WAFDP', 'WAFU', 'WASH', 'WATT', 'WB', 'WBA', 'WBND', 'WCBR', 'WCLD', 'WDAY', 'WDC', 'WDFC', 'WEN', 'WERN', 'WETF', 'WEYS', 'WHF', 'WHFBZ', 'WHLM', 'WHLR', 'WHLRD', 'WHLRP', 'WIFI', 'WILC', 'WIMI', 'WINA', 'WINC', 'WING', 'WINT', 'WIRE', 'WISA', 'WISH', 'WIX', 'WKEY', 'WKHS', 'WLDN', 'WLFC', 'WLTW', 'WMG', 'WNEB', 'WNW', 'WOOD', 'WOOF', 'WORX', 'WPRT', 'WRAP', 'WRLD', 'WSBC', 'WSBCP', 'WSBF', 'WSC', 'WSFS', 'WSTG', 'WTBA', 'WTER', 'WTFC', 'WTFCM', 'WTFCP', 'WTRE', 'WTREP', 'WTRH', 'WVE', 'WVFC', 'WVVI', 'WVVIP', 'WW', 'WWD', 'WWR', 'WYNN', 'XAIR', 'XBIO', 'XBIOW', 'XBIT', 'XCUR', 'XEL', 'XELA', 'XELB', 'XENE', 'XENT', 'XERS', 'XFOR', 'XGN', 'XLNX', 'XLRN', 'XM', 'XNCR', 'XNET', 'XOG', 'XOMA', 'XOMAP', 'XONE', 'XP', 'XPDIU', 'XPEL', 'XPER', 'XRAY', 'XSPA', 'XT', 'XTLB', 'YELL', 'YGMZ', 'YI', 'YJ', 'YLDE', 'YMAB', 'YMTX', 'YNDX', 'YORW', 'YQ', 'YSAC', 'YSACU', 'YSACW', 'YTEN', 'YTRA', 'YVR', 'YY', 'Z', 'ZAZZT', 'ZBRA', 'ZBZZT', 'ZCMD', 'ZCZZT', 'ZEAL', 'ZEUS', 'ZG', 'ZGNX', 'ZGYH', 'ZGYHR', 'ZGYHU', 'ZGYHW', 'ZI', 'ZION', 'ZIONL', 'ZIONN', 'ZIONO', 'ZIONP', 'ZIOP', 'ZIXI', 'ZJZZT', 'ZKIN', 'ZLAB', 'ZM', 'ZNGA', 'ZNTE', 'ZNTEU', 'ZNTEW', 'ZNTL', 'ZS', 'ZSAN', 'ZUMZ', 'ZVO', 'ZVZZC', 'ZVZZT', 'ZWRKU', 'ZWZZT', 'ZXYZ.A', 'ZXZZT', 'ZYNE', 'ZYXI']