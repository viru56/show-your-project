import * as htmlPDF from "html-pdf";
// import validateFirebaseIdToken from '../services/auth.service';

const generateTableoOfImages = (images: any) => {
  if (images.length > 0) {
    var tableElem = `<tr style="margin-top:10px">`;
    for (let i = 0; i < images.length; i++) {
      tableElem += `<td class="investor-image-container"><img class="investor-image" src=${images[i].url} alt=${images[i].name}/></td>`;
      if ((i + 1) % 3 === 0) {
        tableElem += "</tr><tr>";
      }
    }
    tableElem += "</tr>";
    return tableElem;
  } else {
    return "";
  }
}

const getHTML = (data: any) => {
  return `
    <html>
    <header>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500&display=swap" rel="stylesheet">
    <style>
    body{
      font-family: 'Montserrat', sans-serif;
      margin:30px;
    }
    h3{
        font-weight:500;
    }
    p{
        font-weight:300;
    }
    .investor-image-container{
      height:100px;
      width:200px;
    }
    .investor-image{
      display: block;
      max-width:100%;
      max-height: 100%;
      margin-left: auto;
      margin-right: auto;
    }
    .image-container{
      height:300px;
    }
    .idea-image{
      display: block;
      margin: auto;
      max-width:100%;
      max-height: 100%;
    }
    </style>
    </header>
    <body>
    <div>
      <h3 style="text-align: center;text-transform:capitalize;">${data.title}</h3>
      <p style="font-size:12px;margin-top:0;">${
    data.description ? data.description : ""
    }</p>
      <div class="image-container" >
      ${
    data.images.pitchImages.length > 0
      ? `<img class="idea-image" src=${data.images.pitchImages[0].url} />`
      : ""
    }
      </div>
      <h4 style="text-align: center;text-transform:capitalize;">Entrepreneur - ${
    data.createdBy
    }</h4>
      <h4 style="margin-bottom:5px">Problem/Challenge you are trying to solve</h4>
      ${
    data.problemToSolve
      ? `<p style="font-size:12px;margin-top:0;">${data.problemToSolve}</p>`
      : ""
    }
      ${
    data.images.problemToSolve
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.images.problemToSolve
      )}</table>`
      : ""
    }
      <hr>
      <h4 style="margin-bottom:5px">Solution you are offering</h4>
      ${
    data.solutionToOffer
      ? `<p style="font-size:12px;margin-top:0;">${data.solutionToOffer}</p>`
      : ""
    }
        ${
    data.images.solutionToOffer
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.images.solutionToOffer
      )}</table>`
      : ""
    }
        <hr>
      <h4 style="margin-bottom:5px">The team</h4>
      ${
    data.solutionDelivery
      ? `<p style="font-size:12px;margin-top:0;">${data.solutionDelivery}</p>`
      : ""
    }
      ${
    data.images.solutionDelivery
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.images.solutionDelivery
      )}</table>`
      : ""
    }
      ${
    (data.strategy ||
      (data.files.investorPitchFiles &&
        data.files.investorPitchFiles.strategy)) ?
      "<hr>" : ""
    }
      ${
    data.strategy
      ? `<h4 style="margin-bottom:5px">Describe the market size and penetration strategy</h4>
        <p style="font-size:12px;margin-top:0;">${data.strategy}</p>`
      : ""
    }
      ${
    data.files.investorPitchFiles && data.files.investorPitchFiles.strategy
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.files.investorPitchFiles.strategy
      )}</table>`
      : ""
    }   
      ${
    (data.competition ||
      (data.files.investorPitchFiles &&
        data.files.investorPitchFiles.competition)) ?
      "<hr>" : ""
    }
      ${
    data.competition
      ? `<h4 style="margin-bottom:5px">Describe your competition</h4>
      <p style="font-size:12px;margin-top:0;">${data.competition}</p>`
      : ""
    }
      ${
    data.files.investorPitchFiles && data.files.investorPitchFiles.competition
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.files.investorPitchFiles.competition
      )}</table>`
      : ""
    } 
      ${
    (data.swotAnalysis ||
      (data.files.investorPitchFiles &&
        data.files.investorPitchFiles.swotAnalysis)) ?
      "<hr>" : ""
    }
      ${
    data.swotAnalysis
      ? `<h4 style="margin-bottom:5px">SWOT Analysis </h4>
      <p style="font-size:12px;margin-top:0;">${data.swotAnalysis}</p>`
      : ""
    }
      ${
    data.files.investorPitchFiles &&
      data.files.investorPitchFiles.swotAnalysis
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.files.investorPitchFiles.swotAnalysis
      )}</table>`
      : ""
    }    
      ${
    (data.ideaDescrition ||
      (data.files.investorPitchFiles &&
        data.files.investorPitchFiles.ideaDescrition)) ?
      "<hr>" : ""
    }
      ${
    data.ideaDescrition
      ? `<h4 style="margin-bottom:5px">Why Is this a good time to launch your idea</h4>
      <p style="font-size:12px;margin-top:0;">${data.ideaDescrition}</p>`
      : ""
    }
      ${
    data.files.investorPitchFiles &&
      data.files.investorPitchFiles.ideaDescrition
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.files.investorPitchFiles.ideaDescrition
      )}</table>`
      : ""
    }    
        ${
    (data.implementationModel ||
      (data.files.investorPitchFiles &&
        data.files.investorPitchFiles.implementationModel)) ?
      "<hr>" : ""
    }
      ${
    data.implementationModel
      ? `<h4 style="margin-bottom:5px">The implementation model</h4>
      <p style="font-size:12px;margin-top:0;">${data.implementationModel}</p>`
      : ""
    }
      ${
    data.files.investorPitchFiles &&
      data.files.investorPitchFiles.implementationModel
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.files.investorPitchFiles.implementationModel
      )}</table>`
      : ""
    }
      ${
    (data.funds ||
      (data.files.investorPitchFiles &&
        data.files.investorPitchFiles.funds)) ?
      "<hr>" : ""
    }
      ${
    data.funds
      ? `<h4 style="margin-bottom:5px">Source and use of funds</h4>
      <p style="font-size:12px;margin-top:0;">${data.funds}</p>`
      : ""
    }
      ${
    data.files.investorPitchFiles && data.files.investorPitchFiles.funds
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.files.investorPitchFiles.funds
      )}</table>`
      : ""
    }
      ${
    (data.financialModel ||
      (data.files.investorPitchFiles &&
        data.files.investorPitchFiles.financialModel)) ?
      "<hr>" : ""
    }
      ${
    data.financialModel
      ? `<h4 style="margin-bottom:5px">Financial model/Projections and key ratios</h4>
      <p style="font-size:12px;margin-top:0;">${data.financialModel}</p>`
      : ""
    }
      ${
    data.files.investorPitchFiles &&
      data.files.investorPitchFiles.financialModel
      ? `<table style="width:100%;">${generateTableoOfImages(
        data.files.investorPitchFiles.financialModel
      )}</table>`
      : ""
    }
      </div>
      </body>
      </html>
      `;
};

const getBuffer = (data: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    htmlPDF.create(getHTML(data), {
      height: "30in", // allowed units: mm, cm, in, px
      width: "15in", // allowed units: mm, cm, in, px
      timeout: 1200000
    }).toBuffer((err: Error, buffer: Buffer) => {
      if (err) {
        reject(err);
      }
      resolve(buffer);
    })
  })
}
export default async (req: any, res: any) => {
  try {
    //  await validateFirebaseIdToken(req, res,admin);
    if ((!req.body || !req.body.title)) {
      return res.status(400).send({ error: "invalid request", body: req.body });
    }
    const buffer: Buffer = await getBuffer(req.body);
    res.set({
      "Cache-Control": "no-cache",
      "Content-Type": "application/pdf",
      "Content-Length": buffer.length,
      "Content-Disposition": "attachment; filename=" + "download.pdf"
    });
    return res.status(200).send(buffer);

  } catch (error) {
    return res.status(200).send(error);
  }

}
