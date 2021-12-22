const { equal } = require('assert');
const { PRIORITY_LOW } = require('constants');
let fs=require('fs');
const { exit, mainModule } = require('process');
let input=process.argv;
let inputSize=input.length;
let engAlf='abcdefghijklmnopqrstuvwxyz';
let upEngAlf=engAlf.toUpperCase();
let rusAlf='абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
let upRusAlf=rusAlf.toUpperCase();
//console.log(upEngAlf,upRusAlf);
function RF()
{
    try {
        s=fs.readFileSync(input[inputSize-3],'utf-8');
      } catch {
        console.log(`Incorrect arguments. Try 'node hash.js [keys][b/h1/h2/h3][str file][substr file]`);
        return;
      }
    //console.log(s);
    try {
        t=fs.readFileSync(input[inputSize-4],'utf-8');
      } catch {
        console.log(`Incorrect arguments. Try 'node hash.js [keys][b/h1/h2/h3][str file][substr file]`);
        return;
      }
}

function changeSymbol(a,shift,lang)
{
    let pos;
    let Capital=false;
    
    if (lang=='en')
    {
        pos=engAlf.indexOf(a);
        if (pos==-1)
        {
            if (upEngAlf.indexOf(a)==-1) {return a;} 
            Capital=true;
            pos=upEngAlf.indexOf(a)
            a=a.toLowerCase();
        }
        pos=(pos+shift)%26;
        if (pos<0) {pos=26+pos;}
        a=engAlf[pos];
    }
    if (lang=='ru')
    {
        pos=rusAlf.indexOf(a);
        if (pos==-1)
        {
            if (upRusAlf.indexOf(a)==-1) {return a;} 
            Capital=true;
            pos=upRusAlf.indexOf(a);
            a=a.toLowerCase();
        }
        pos=(pos+shift)%33;
        if (pos<0) {pos=33+pos;}
        a=rusAlf[pos];
    }
    if (Capital) {a=a.toUpperCase();}
    return a;
}

function code()
{
    let original=fs.readFileSync(input[inputSize-4],'utf-8');
    let shift=parseInt(input[inputSize-2]);
    let lang=input[inputSize-1];
    let shifted='';
    //console.log(shift,lang);
    //console.log(original);

    for (i=0;i<original.length;i++)
    {
        shifted=shifted+changeSymbol(original[i],shift,lang);
    }
    //console.log(shifted);
    fs.writeFileSync(input[inputSize-3],shifted);
}

function decode()
{
    let engFreq=new Map();
    engFreq.set('a',    817);
    engFreq.set('b',	149); 
    engFreq.set('c',	278 );
    engFreq.set('d',	425 );
    engFreq.set('e',	1270 );
    engFreq.set('f',	223 );
    engFreq.set('g',	202 );
    engFreq.set('h',	609 );
    engFreq.set('i',	697 );
    engFreq.set('j',	15 );
    engFreq.set('k',	77 );
    engFreq.set('l',	403 );
    engFreq.set('m',	241 );
    engFreq.set('n',	675 );
    engFreq.set('o',	751 );
    engFreq.set('p',	193 );
    engFreq.set('q',	10 );
    engFreq.set('r',	599 );
    engFreq.set('s',	633 );
    engFreq.set('t',	906 );
    engFreq.set('u',    276 );
    engFreq.set('v',	98 );
    engFreq.set('w',	236 );
    engFreq.set('x',	015 );
    engFreq.set('y',	197 );
    engFreq.set('z',	7 );
    
    let rusFreq=new Map();
    rusFreq.set('о' , 928);
    rusFreq.set('а' , 866);
    rusFreq.set('е' , 810);
    rusFreq.set('и' , 745);
    rusFreq.set('н' , 635);
    rusFreq.set('т' , 630);
    rusFreq.set('р' , 553);
    rusFreq.set('с' , 545);
    rusFreq.set('л' , 432);
    rusFreq.set('в' , 419);
    rusFreq.set('к' , 347);
    rusFreq.set('п' , 335);
    rusFreq.set('м' , 329);
    rusFreq.set('у' , 290);
    rusFreq.set( 'д' , 256);
    rusFreq.set('я' , 222);
    rusFreq.set( 'ы' , 211);
    rusFreq.set( 'ь' , 190);
    rusFreq.set(  'з' , 181);
    rusFreq.set(  'б' , 151);
    rusFreq.set(  'г' , 141);
    rusFreq.set(   'й' , 131);
    rusFreq.set(  'ч' , 127);
    rusFreq.set(  'ю' , 103);
    rusFreq.set(  'х' , 92);
    rusFreq.set(  'ж' , 78);
    rusFreq.set(  'ш' , 77);
    rusFreq.set(  'ц' , 52);
    rusFreq.set(  'щ' , 49);
    rusFreq.set( 'ф' , 40);
    rusFreq.set( 'э' , 17);
    rusFreq.set('ё',4);
    rusFreq.set('ъ',1);
    //console.log(rusFreq);

    let coded=fs.readFileSync(input[inputSize-3],'utf-8');
    let rez=coded;
    coded=coded.toLowerCase();
    let lang=input[inputSize-1];
    let best=0;
    let bestshift=0;
    let cursum=0;
    if (lang=='en')
    {
        for (i=-26;i<=26;i++)
        {
            let possible='';
            for (j=0;j<coded.length;j++)
            {
                possible+=changeSymbol(coded[j],i,'en');
            }
            cursum=0;
            for (j=0;j<possible.length;j++)
            {
                if (engFreq.has(possible[j]))
                {
                    cursum+=engFreq.get(possible[j]);
                } 
            }
            //console.log(i,possible,cursum);
            if (cursum>best) {best=cursum; bestshift=i;}
        }
    }
    if (lang=='ru')
    {
        for (i=-33;i<=33;i++)
        {
            let possible='';
            for (j=0;j<coded.length;j++)
            {
                possible+=changeSymbol(coded[j],i,'ru');
            }
            cursum=0;
            //console.log(i,possible,cursum);
            for (j=0;j<possible.length;j++)
            {
                if (rusFreq.has(possible[j]))
                {
                    cursum+=rusFreq.get(possible[j]);
                }     
            }
            //console.log(i,possible,cursum);
            if (cursum>best) {best=cursum; bestshift=i;}
        }
    }


    //console.log('aaa',bestshift);
    let possible='';
    coded=rez;
    for (j=0;j<coded.length;j++)
    {
        possible+=changeSymbol(coded[j],bestshift,lang);
    }
    fs.writeFileSync(input[inputSize-2],possible);

}

if (input[2]=='code')
{
    code();
}
else
{
    if (input[2]=='decode')
    {
        decode();
    }
    else {console.log('ERROR : Wrong method');}
}
