// Asset Downloader - Tüm görselleri toplar ve indirir
import JSZip from 'jszip';

// Tüm görselleri import et
import posterImage from 'figma:asset/ebb8bb32b8e0dea89f86ff9acdcc47b2bd33e4e1.png';
import nugget1 from 'figma:asset/87c6e5633d3b86a90a606b4576db9ad8b897bf65.png';
import nugget2 from 'figma:asset/a87e23c7309a855b0053f7c274dca265018f28b9.png';
import nugget3 from 'figma:asset/e0f540fb96bc0ee236bf97932db3e49a4c3ec7e7.png';
import nugget4 from 'figma:asset/1b901894fd12885c5205e8ec935ca0b0fdf63d3c.png';
import nugget5 from 'figma:asset/36849b0161ba777bbf741817f3817f3d9903e79b.png';
import nugget6 from 'figma:asset/8ff963d42fb8356787a618b3a6f4f440b5c86979.png';
import boxImage from 'figma:asset/bdaee6c6bd1633df650705c0e070dc9b548c71df.png';
import dinoLogo from 'figma:asset/011581239f3540ba8af2291c98cfb1d8ff3ce364.png';
import heroBackground from 'figma:asset/4f7be6a6028066a8e1544e366fe8dcab93cf443d.png';
import heroBackgroundMobile from 'figma:asset/0232ca3c7ee03925508aea660aad850786177447.png';
import burntBadge from 'figma:asset/6188d4c3025f609c0ac141d5ffc840a9136523da.png';
import backgroundImage from 'figma:asset/05d680bd1e704bd836895cbd9cd2bd0c79ce9abb.png';
import logoImage from 'figma:asset/b75c82f2759c60bda51449a9c6cbe4c452606c5e.png';
import notification1Image from 'figma:asset/072991bb310d39ecb2293b9a1b92d7d8a5835571.png';
import notification2Image from 'figma:asset/ef4be9c935a0f1fefdc228205c58df423030ca6b.png';
import notification3Image from 'figma:asset/ccb4a33772c8e805b4ac190f749c86bc8d6abe8e.png';
import product1Image from 'figma:asset/1d0677ffc9fbb5eb065e07a802e26f0291399a56.png';
import product2Image from 'figma:asset/89b4b943833cca7e5beff5a05da9b4ecebf890c5.png';
import daggerImage from 'figma:asset/a3122136c18b8746177bfceb8409e6ac3235f018.png';
import heroImageMobile from 'figma:asset/775e0651d0a2fc10dd46d0098eab5c99416aba11.png';
import heroImageDesktop from 'figma:asset/01835af4bd8307f4c8b7ea1e609f9c284dec1de3.png';
import heroImageMobile2 from 'figma:asset/28a035d503dad50f3c542d3daa0fb63793b9c0d5.png';
import heroImageDesktop2 from 'figma:asset/34a9ee9f12c176ad62bf5414a72c3f33843d0c0f.png';
import ringImage from 'figma:asset/1dd76164e8cd3bfee22f4b3f4a5fb92822068579.png';
import weightsMaskImage from 'figma:asset/b583c3d0283211ec16195f4a5a5a5cba0f202489.png';
import backgroundWithWeights from 'figma:asset/b59efb1054b8306e12f38ccdf836905f73415cd1.png';
import backgroundWithWeightsMobile from 'figma:asset/5fb39628f245f0af6d2e20e9b5468356546cf8fb.png';
import chainLinkHorizontal from 'figma:asset/35747f0834e86f22a9214abe251e58e984a85239.png';
import chainLinkVertical from 'figma:asset/edc29ae7e0d254930c4c69a8a9d7a48dd6e0c2b4.png';
import slide2Image from 'figma:asset/f53480cc97bf677d6d075493083c3e3d6eb08ed8.png';
import carouselImage1 from 'figma:asset/8ed66c3c4d4cd5a3780b1cb7e871dff2b4e8fb30.png';
import carouselImage2 from 'figma:asset/8acc61aa8916f66533147e3e5542e476b65283e8.png';
import logoImageHeavy from 'figma:asset/e3b67df63ce0fa3a5feedd58f9117c00106d9fbe.png';
import newBackgroundDesktop from 'figma:asset/71fa5f81239abbaddcdc4b2fb49d329b7221e544.png';
import newMaskDesktop from 'figma:asset/ce34b7e357d08b03fbe7bfc5ba2f9dd39ccb5087.png';
import gnomesImage from 'figma:asset/da7a3c1fe8d58d8bb395156f10749f56c83afe45.png';
import maskImage from 'figma:asset/e76556b2c0ebc8f445d86596c24b2090479fadcd.png';
import gnomesImageMobile from 'figma:asset/e0db25129eaacbca56f1ac856a99734ad1cfc5fc.png';
import maskImageMobile from 'figma:asset/50b4e0e75a56e30dd5d7c3c83e3b26a7c66b1e8b.png';
import logoImageGnomes from 'figma:asset/c92828cc1e101d259fe01f30c8b43a5b2b94cdab.png';
import product1 from 'figma:asset/e87a0f6eedcf2605de14105ebff329021b199ebd.png';
import product2 from 'figma:asset/a90d406f96bba310c5c07a56b56963589a6e2ccc.png';
import product3 from 'figma:asset/84783afae28516fb279cc3a06a68209f8d7bc557.png';
import product4 from 'figma:asset/c5e11c813c8241f445740d2e4bab7bc0a4fe2052.png';
import product4Image2 from 'figma:asset/9c577e82f57156c6a76f20178ec6fefcd299f7a0.png';
import luxuryTaxImageDesktop from 'figma:asset/d2bb77bfe343f4dd01e0d0685046dd955320dc63.png';
import luxuryTaxImageMobile from 'figma:asset/f5131ea865d84df984b183405cbed4e9e12c6a0f.png';
import luxuryTaxImage2Desktop from 'figma:asset/94e18505e97ca328a2df5017b9873cf04d2a74f3.png';
import luxuryTaxImage2Mobile from 'figma:asset/00fbc80764e240617e964454f23d8c0bfdbe0159.png';
import luxuryTaxImage3Desktop from 'figma:asset/b292685d6a9c7cd813b043deeb39ae203bb0a640.png';
import luxuryTaxImage3Mobile from 'figma:asset/d1d3db4fd565600a8f60455e8483fe79cd665967.png';
import cursorImagePath from 'figma:asset/b1e5e29251619866fb1746252056f5feadd9eed7.png';
import logoImageLuxury from 'figma:asset/c49a1aab71dcc7c317f91fee4d5939c60d1b7258.png';
import wishTotemImage from 'figma:asset/6981688d98a6c54a53247ebaa65c6f958eca594c.png';
import silvaLeafImage from 'figma:asset/52f99575e762dadc68157672293e58f5725bc4be.png';
import silenceCanImage from 'figma:asset/677a47650dba393cdfce78a30117f566ab3c41c4.png';
import bearImage from 'figma:asset/e087f4f094577e04a5f76e903bef6e7050c4b06d.png';
import maskImageBear from 'figma:asset/076a3e8e563f6c9c7516a7675be4d91e18761a9e.png';
import bearImageMobile from 'figma:asset/67b313061ca302c2122a53094e505603dd38db4b.png';
import maskImageMobileBear from 'figma:asset/311d438100cff10200c05b1fc9078235e9fb949e.png';
import logoImageBear from 'figma:asset/60726b1b3091f43a763a0ef9c468634ee0d1c5f1.png';
import inspectImage from 'figma:asset/ba94c76f37b2e8beebf3e7b27cc439642333babe.png';
import inspectSlide1 from 'figma:asset/a5cfb9a07856cba0335af3d5c930a27debf69506.png';
import inspectSlide2 from 'figma:asset/6cbe98e4650a873e6c445da4162b440e43504547.png';
import logoImagePiggy from 'figma:asset/e6578e36df0068129beee5fa033a945ca20b606f.png';
import piggyImage1 from 'figma:asset/303ea44ee8d45b92ed708aa8f04dd39b7d02554e.png';
import piggyImage2 from 'figma:asset/1d0b24abe08602f8b743de302d3f4bcd1b07c6b4.png';
import tapToSaveImage from 'figma:asset/1299c1da88e9f43000278016cdc1a5a3d87d44cc.png';
import only400Image from 'figma:asset/5a1bb24248dd4e8d7cac5cb955d7085030effbc3.png';
import displayOnlyImage from 'figma:asset/a97f3178a05fd22780b9cb92350ea42ae326d97d.png';
import cursorImage from 'figma:asset/cdb2ffeee07342b813a399487ceed715208422f4.png';
import collectorsImage from 'figma:asset/e9b575b21f9e3da2e1fdfa7803efe28f4b4cd91f.png';
import seeThePieceImage from 'figma:asset/949b12a9353f0033a4325256b3bdeb597e27ffae.png';
import productImage1 from 'figma:asset/9db63ee30e542d6debc5faf89301fb14168a84b5.png';
import productImage2 from 'figma:asset/6f96b792dd8e4fb4aaa7fe5e95b63c71bc8dd967.png';
import productImage3 from 'figma:asset/73b3744bc191f127d01db86f7566dcf2d5847635.png';
import dinoLogoIntro from 'figma:asset/1dac0bada73c9a675d11784842cbfb9d3f940415.png';
import fryLogo from 'figma:asset/859d7039de2c6dfbce8037bc6e754112df0470b0.png';
import bearLogo from 'figma:asset/f8360a97097976c09d71565fb487148c29f2566c.png';
import luxuryLogo from 'figma:asset/a33b796b9221686891136228ff377a1e289782e1.png';
import gnomesLogo from 'figma:asset/74e760c01457d2b0cdecad53254197af6344d3a5.png';
import heavyRingLogo from 'figma:asset/5a0a3c3497ebcf9e579ea5f2e73ffeaf7b8c26d2.png';
import piggyBankLogo from 'figma:asset/73fb2ca114612038b657e453f518f72149d40069.png';
import fileFlakesLogo from 'figma:asset/f53400a753dd5dc0d90bd05226c0a1e284f50b4e.png';
import multiverseLogo from 'figma:asset/ea234ab423d289573b8a80e1b026eb6de4f712ec.png';
import logo from 'figma:asset/d88d5e5df971b5314a55f38fef7a3d682f121508.png';

// Asset mapping
const assets = [
  { path: 'five-minutes-silence/posterImage.png', url: posterImage },
  { path: 'dino-nugget/nugget1.png', url: nugget1 },
  { path: 'dino-nugget/nugget2.png', url: nugget2 },
  { path: 'dino-nugget/nugget3.png', url: nugget3 },
  { path: 'dino-nugget/nugget4.png', url: nugget4 },
  { path: 'dino-nugget/nugget5.png', url: nugget5 },
  { path: 'dino-nugget/nugget6.png', url: nugget6 },
  { path: 'dino-nugget/boxImage.png', url: boxImage },
  { path: 'dino-nugget/dinoLogo.png', url: dinoLogo },
  { path: 'dino-nugget/heroBackground.png', url: heroBackground },
  { path: 'dino-nugget/heroBackgroundMobile.png', url: heroBackgroundMobile },
  { path: 'dino-nugget/burntBadge.png', url: burntBadge },
  { path: 'file-flakes/backgroundImage.png', url: backgroundImage },
  { path: 'file-flakes/logoImage.png', url: logoImage },
  { path: 'file-flakes/notification1Image.png', url: notification1Image },
  { path: 'file-flakes/notification2Image.png', url: notification2Image },
  { path: 'file-flakes/notification3Image.png', url: notification3Image },
  { path: 'file-flakes/product1Image.png', url: product1Image },
  { path: 'file-flakes/product2Image.png', url: product2Image },
  { path: 'fry-daggers/daggerImage.png', url: daggerImage },
  { path: 'fry-daggers/heroImageMobile.png', url: heroImageMobile },
  { path: 'fry-daggers/heroImageDesktop.png', url: heroImageDesktop },
  { path: 'fry-daggers/heroImageMobile2.png', url: heroImageMobile2 },
  { path: 'fry-daggers/heroImageDesktop2.png', url: heroImageDesktop2 },
  { path: 'heavy-ring/ringImage.png', url: ringImage },
  { path: 'heavy-ring/weightsMaskImage.png', url: weightsMaskImage },
  { path: 'heavy-ring/backgroundWithWeights.png', url: backgroundWithWeights },
  { path: 'heavy-ring/backgroundWithWeightsMobile.png', url: backgroundWithWeightsMobile },
  { path: 'heavy-ring/chainLinkHorizontal.png', url: chainLinkHorizontal },
  { path: 'heavy-ring/chainLinkVertical.png', url: chainLinkVertical },
  { path: 'heavy-ring/slide2Image.png', url: slide2Image },
  { path: 'heavy-ring/carouselImage1.png', url: carouselImage1 },
  { path: 'heavy-ring/carouselImage2.png', url: carouselImage2 },
  { path: 'heavy-ring/logoImage.png', url: logoImageHeavy },
  { path: 'heavy-ring/newBackgroundDesktop.png', url: newBackgroundDesktop },
  { path: 'heavy-ring/newMaskDesktop.png', url: newMaskDesktop },
  { path: 'home-gnomes/gnomesImage.png', url: gnomesImage },
  { path: 'home-gnomes/maskImage.png', url: maskImage },
  { path: 'home-gnomes/gnomesImageMobile.png', url: gnomesImageMobile },
  { path: 'home-gnomes/maskImageMobile.png', url: maskImageMobile },
  { path: 'home-gnomes/logoImage.png', url: logoImageGnomes },
  { path: 'home-gnomes/product1.png', url: product1 },
  { path: 'home-gnomes/product2.png', url: product2 },
  { path: 'home-gnomes/product3.png', url: product3 },
  { path: 'home-gnomes/product4.png', url: product4 },
  { path: 'home-gnomes/product4Image2.png', url: product4Image2 },
  { path: 'luxury-tax/luxuryTaxImageDesktop.png', url: luxuryTaxImageDesktop },
  { path: 'luxury-tax/luxuryTaxImageMobile.png', url: luxuryTaxImageMobile },
  { path: 'luxury-tax/luxuryTaxImage2Desktop.png', url: luxuryTaxImage2Desktop },
  { path: 'luxury-tax/luxuryTaxImage2Mobile.png', url: luxuryTaxImage2Mobile },
  { path: 'luxury-tax/luxuryTaxImage3Desktop.png', url: luxuryTaxImage3Desktop },
  { path: 'luxury-tax/luxuryTaxImage3Mobile.png', url: luxuryTaxImage3Mobile },
  { path: 'luxury-tax/cursorImagePath.png', url: cursorImagePath },
  { path: 'luxury-tax/logoImage.png', url: logoImageLuxury },
  { path: 'multiverse-black-market/wishTotemImage.png', url: wishTotemImage },
  { path: 'multiverse-black-market/silvaLeafImage.png', url: silvaLeafImage },
  { path: 'multiverse-black-market/silenceCanImage.png', url: silenceCanImage },
  { path: 'ozempic-bear/bearImage.png', url: bearImage },
  { path: 'ozempic-bear/maskImage.png', url: maskImageBear },
  { path: 'ozempic-bear/bearImageMobile.png', url: bearImageMobile },
  { path: 'ozempic-bear/maskImageMobile.png', url: maskImageMobileBear },
  { path: 'ozempic-bear/logoImage.png', url: logoImageBear },
  { path: 'ozempic-bear/inspectImage.png', url: inspectImage },
  { path: 'ozempic-bear/inspectSlide1.png', url: inspectSlide1 },
  { path: 'ozempic-bear/inspectSlide2.png', url: inspectSlide2 },
  { path: 'piggy-bank/logoImage.png', url: logoImagePiggy },
  { path: 'piggy-bank/piggyImage1.png', url: piggyImage1 },
  { path: 'piggy-bank/piggyImage2.png', url: piggyImage2 },
  { path: 'piggy-bank/tapToSaveImage.png', url: tapToSaveImage },
  { path: 'piggy-bank/only400Image.png', url: only400Image },
  { path: 'piggy-bank/displayOnlyImage.png', url: displayOnlyImage },
  { path: 'piggy-bank/cursorImage.png', url: cursorImage },
  { path: 'piggy-bank/collectorsImage.png', url: collectorsImage },
  { path: 'piggy-bank/seeThePieceImage.png', url: seeThePieceImage },
  { path: 'piggy-bank/productImage1.png', url: productImage1 },
  { path: 'piggy-bank/productImage2.png', url: productImage2 },
  { path: 'piggy-bank/productImage3.png', url: productImage3 },
  { path: 'section-intro/dinoLogo.png', url: dinoLogoIntro },
  { path: 'section-intro/fryLogo.png', url: fryLogo },
  { path: 'section-intro/bearLogo.png', url: bearLogo },
  { path: 'section-intro/luxuryLogo.png', url: luxuryLogo },
  { path: 'section-intro/gnomesLogo.png', url: gnomesLogo },
  { path: 'section-intro/heavyRingLogo.png', url: heavyRingLogo },
  { path: 'section-intro/piggyBankLogo.png', url: piggyBankLogo },
  { path: 'section-intro/fileFlakesLogo.png', url: fileFlakesLogo },
  { path: 'section-intro/multiverseLogo.png', url: multiverseLogo },
  { path: 'splash-screen/logo.png', url: logo },
];

export async function downloadAllAssets(onProgress?: (progress: number) => void) {
  const zip = new JSZip();
  const totalAssets = assets.length;
  let completed = 0;

  // README dosyası ekle
  const readmeContent = `# MSCHF Style Website Assets

Bu klasör sitedeki tüm görselleri içerir.

## Klasör Yapısı
- dino-nugget/ - DinoNugget projesi görselleri
- file-flakes/ - File Flakes projesi görselleri
- fry-daggers/ - Fry Daggers projesi görselleri
- heavy-ring/ - Heavy Ring projesi görselleri
- home-gnomes/ - Home Gnomes projesi görselleri
- luxury-tax/ - Luxury Tax projesi görselleri
- multiverse-black-market/ - Multiverse Black Market projesi görselleri
- ozempic-bear/ - Ozempic Bear projesi görselleri
- piggy-bank/ - Piggy Bank projesi görselleri
- section-intro/ - Section intro logoları
- splash-screen/ - Splash screen logosu
- five-minutes-silence/ - Five Minutes Silence Can görseli

## Kullanım
Görselleri projenizde kullanmak için:
1. Bu klasörü projenizin \`public/assets/\` veya \`src/assets/\` klasörüne kopyalayın
2. Import pathlerini güncelleyin:
   \`\`\`tsx
   // Önce: import nugget1 from 'figma:asset/87c6e5633d3b86a90a606b4576db9ad8b897bf65.png';
   // Sonra: import nugget1 from './assets/dino-nugget/nugget1.png';
   \`\`\`

Toplam ${totalAssets} görsel dosyası bulunmaktadır.
`;
  zip.file('README.md', readmeContent);

  // Her bir görseli fetch et ve ZIP'e ekle
  for (const asset of assets) {
    try {
      const response = await fetch(asset.url);
      const blob = await response.blob();
      zip.file(asset.path, blob);
      
      completed++;
      if (onProgress) {
        onProgress(Math.round((completed / totalAssets) * 100));
      }
    } catch (error) {
      console.error(`Failed to download ${asset.path}:`, error);
    }
  }

  // ZIP dosyasını oluştur ve indir
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mschf-website-assets.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
