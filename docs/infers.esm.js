var u=class{constructor(t){if(!t[0])throw new Error("Matrix at least one row");if(t.find((r,i)=>t[i-1]&&r.length!==t[i-1].length))throw new Error("Matrix column inconsistent");if(!t[0].length)throw new Error("Matrix has at least one element from row");this.shape=[t.length,t[0].length],this.self=t}slice(t,e){return new u(this.self.slice(t,e))}argMax(t){let e=this.getRow(t),r=e[0],i=0;for(let n=0;n<e.length;n++)e[n]>r&&(r=e[n],i=n);return i}connect(t){if(this.shape[1]!==t.shape[1])throw new Error("Matrix column inconsistent");let e=this.dataSync().concat(t.dataSync());return new u(e)}zeroed(){return this.atomicOperation(t=>0)}clone(){return new u(this.dataSync())}getMeanOfRow(t){let e=this.getRow(t);return e.reduce((r,i)=>r+i)/e.length}sum(){let t=0;for(let e=0;e<this.shape[0];e++)for(let r=0;r<this.shape[1];r++)t+=this.get(e,r);return t}columnSum(){let t=[];for(let e=0;e<this.shape[1];e++)t.push(this.getCol(e).reduce((r,i)=>r+i));return new u([t])}dataSync(){let t=[];for(let e=0;e<this.shape[0];e++){let r=[];for(let i=0;i<this.shape[1];i++)r.push(this.get(e,i));t.push(r)}return t}equalsShape(t){return this.shape[0]===t.shape[0]&&this.shape[1]===t.shape[1]}equals(t){if(!this.equalsShape(t))return!1;for(let e=0;e<this.shape[0];e++)for(let r=0;r<this.shape[1];r++)if(this.get(e,r)!==t.get(e,r))return!1;return!0}static generateIdentity(t){let e=this.generate(t,t,0),r=0;for(let i=0;i<e.shape[0];i++)e.update(i,r++,1);return e}static generate(t,e,r={range:[-.5,.5]}){let i=[];for(let n=0;n<t;n++){let s=[];for(let a=0;a<e;a++){let o=0;if(typeof r=="number")o=r;else{let[h,l]=[Math.min(...r.range),Math.max(...r.range)],c=h<0||l<0?-1:0;o=Math.random()*(l-h)+h+c,r.integer&&(o=~~o)}s.push(o)}i.push(s)}return new u(i)}update(t,e,r,i){switch(i){case"+=":this.self[t][e]+=r;break;case"-=":this.self[t][e]-=r;break;case"*=":this.self[t][e]*=r;break;case"/=":this.self[t][e]/=r;break;default:this.self[t][e]=r}}expand(t,e){let r=[];for(let i=0;i<this.shape[0];i++){let n=e==="L"?[t,...this.getRow(i)]:e==="R"?[...this.getRow(i),t]:[...this.getRow(i)];r.push(n)}return e==="T"?r.unshift(new Array(r[0].length).fill(t)):e==="B"&&r.push(new Array(r[0].length).fill(t)),new u(r)}get(t,e){return this.self[t][e]}getRow(t){return[...this.self[t]]}getCol(t){let e=[];for(let r=0;r<this.shape[0];r++)for(let i=0;i<this.shape[1];i++)i===t&&e.push(this.get(r,i));return e}adjugate(){if(this.shape[0]!==this.shape[1])throw new Error("\u53EA\u6709\u65B9\u9635\u624D\u80FD\u6C42\u4F34\u968F\u77E9\u9635");return this.shape[0]===1?new u([[1]]):this.shape[0]===2?new u([[this.get(1,1),this.get(0,1)*-1],[this.get(1,0)*-1,this.get(0,0)]]):this.clone().atomicOperation((t,e,r)=>this.cominor(e,r).det()*(-1)**(e+r+2)).T}inverse(){if(this.shape[0]!==this.shape[1])throw new Error("\u53EA\u6709\u65B9\u9635\u624D\u80FD\u6C42\u9006");let t=this.det();if(t===0)throw new Error("\u8BE5\u77E9\u9635\u4E0D\u53EF\u9006");return this.adjugate().atomicOperation(r=>r/t)}det(){if(this.shape[0]!==this.shape[1])throw new Error("\u53EA\u6709\u65B9\u9635\u624D\u80FD\u8BA1\u7B97\u884C\u5217\u5F0F");if(this.shape[0]===1)throw new Error("\u77E9\u9635\u884C\u5FC5\u987B\u5927\u4E8E1");if(this.shape[0]===2&&this.shape[1]===2)return this.get(0,0)*this.get(1,1)-this.get(0,1)*this.get(1,0);{let t=0;for(let e=0;e<this.shape[1];e++)this.get(0,e)!==0&&(t+=this.get(0,e)*(-1)**(e+2)*this.cominor(0,e).det());return t}}cominor(t,e){if(this.shape[0]<2||this.shape[1]<2)throw new Error("\u6C42\u4F59\u5B50\u5F0F\u884C\u548C\u5217\u5FC5\u987B\u5927\u4E8E2\u624D\u6709\u610F\u4E49");let r=this.dataSync().map(i=>(i=i.filter((n,s)=>s!==e),i)).filter((i,n)=>n!==t);return new u(r)}atomicOperation(t){let e=[];for(let r=0;r<this.shape[0];r++){let i=[];for(let n=0;n<this.shape[1];n++)i.push(t(this.get(r,n),r,n));e.push(i)}return new u(e)}coLocationOperation(t,e){if(!this.equalsShape(t))throw new Error("\u5FC5\u987B\u6EE1\u8DB3\u4E24\u4E2A\u77E9\u9635\u662F\u540C\u5F62\u77E9\u9635");let r=[];for(let i=0;i<this.shape[0];i++){let n=[];for(let s=0;s<this.shape[1];s++){let[a,o]=[this.get(i,s),t.get(i,s)],h=e==="add"?a+o:e==="sub"?a-o:e==="mul"?a*o:e==="exp"?a/o:a;n.push(h)}r.push(n)}return new u(r)}subtraction(t){return this.coLocationOperation(t,"sub")}addition(t){return this.coLocationOperation(t,"add")}multiply(t){if(typeof t=="number")return this.atomicOperation(s=>s*t);if(this.shape[1]!==t.shape[0])throw new Error("\u5F53\u77E9\u9635A\u7684\u5217\u6570\u7B49\u4E8E\u77E9\u9635B\u7684\u884C\u6570\uFF0CA\u4E0EB\u624D\u53EF\u4EE5\u76F8\u4E58");let e=this.shape[0],r=t.shape[1],i=t.T,n=[];for(let s=0;s<e;s++){let a=[];for(let o=0;o<r;o++){let h=this.getRow(s).reduce((l,c,p)=>l+c*i.get(o,p),0);a.push(h)}n.push(a)}return new u(n)}get T(){let t=[];for(let e=0;e<this.shape[1];e++){let r=[];for(let i=0;i<this.shape[0];i++)r.push(this.get(i,e));t.push(r)}return new u(t)}normalization(t="average"){let e=this.T,r=[];for(let i=0;i<e.shape[0];i++){let n=Math.max(...e.getRow(i)),s=Math.min(...e.getRow(i)),a=n-s,o=s+a/2,h=t==="average"?o:s;r.push([h,a]);for(let l=0;l<e.shape[1];l++){let c=a===0?0:(e.get(i,l)-h)/a;e.update(i,l,c)}}return[e.T,new u(r).T]}print(){console.log(`Matrix ${this.shape[0]}x${this.shape[1]} [`);for(let t=0;t<this.shape[0];t++){let e=" ";for(let r=0;r<this.shape[1];r++)e+=this.get(t,r)+", ";console.log(e)}console.log("]")}};var x=class{constructor(t,e){this.X=t;this.Y=e}contrast(t){return this.X===t.X&&this.Y===t.Y}},P=class{constructor(t,e){if(this.start=new x(t[0],t[1]),this.end=new x(e[0],e[1]),this.start.contrast(this.end))throw new Error("\u4E24\u4E2A\u70B9\u4E0D\u80FD\u76F8\u540C")}minXY(){let t=Math.min(this.start.X,this.end.X),e=Math.min(this.start.Y,this.end.Y);return new x(t,e)}maxXY(){let t=Math.max(this.start.X,this.end.X),e=Math.max(this.start.Y,this.end.Y);return new x(t,e)}testPointIn(t){if(t.contrast(this.start)||t.contrast(this.end))return!0;let e=t.X-this.start.X==0?Infinity:(t.Y-this.start.Y)/(t.X-this.start.X),r=t.X-this.end.X==0?Infinity:(t.Y-this.end.Y)/(t.X-this.end.X);return e===r}testPointInside(t){if(this.testPointIn(t)){let e=this.minXY(),r=this.maxXY();return t.X>=e.X&&t.X<=r.X&&t.Y>=e.Y&&t.Y<=r.Y}return!1}},z=class{constructor(t){this.points=[];for(let a=0;a<t.length;a++)this.points.push(new x(t[a][0],t[a][1]));if(this.points.length<