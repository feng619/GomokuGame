import { Meteor } from 'meteor/meteor';
import { Gomoku } from '../../imports/collections/gomoku';

// function makeASandwichWithSecretSauce(a) {
//   return function (dispatch) {
//     console.log('a',a);
//     //const pagedata = Gomoku.find({}, { skip: a[0], limit: a[1], sort: {createdAt: -1} }).fetch();
//     //const ttldata = Gomoku.find().count();
//
//     const pagenum = a[2];
//     return timeout(100, a).then(
//       pagedata => dispatch(makePage( pagedata, 15, pagenum )),
//       error => dispatch(makePage( 0, 15, 5 ))
//     );
//   };
// }

function timeout(ms, a) {
  return new Promise((resolve, reject) => {
    const ans = Meteor.subscribe('paginate', a);
    const xx = Gomoku.find({}, { skip: a[0], limit: a[1], sort: {createdAt: -1} }).fetch();
    console.log('a',a);
    console.log('xx',xx);
    if(ans.ready())
    setTimeout(resolve, ms, xx);

    // console.log('ans',ans); console.log('ready',ans.ready());
    // if(ans.ready())
    // resolve(Gomoku.find({}, { skip: a[0], limit: a[1], sort: {createdAt: -1} }).fetch())
  });
}


// function makePage( pagedata, ttldata, pagenum ) {
//   return {
//     type: 'PAGINATE',
//     // [當頁的資料, 總資料數, 現在在第幾頁]
//     payload: [ pagedata, ttldata, pagenum ]
//   }
// }


export const perPage = 5;
export function onPage( a ){

  return function (dispatch) {
    return timeout(3000, a).then(
      value => dispatch({
        type: 'PAGINATE',
        payload: [ value, 20, 1 ]
      }),
      error => dispatch({
        type: 'PAGINATE',
        payload: [error]
      })
    );
  };
}


// -------------------------------------
// export const perPage = 5;
// export function onPage( a ){
//   console.log('a',a);
//   const pagedata = Gomoku.find({}, { skip: a[0], limit: a[1], sort: {createdAt: -1} }).fetch();
//   const ttldata = Gomoku.find().count();
//   const pagenum = a[2];
//   console.log('action',[ pagedata, ttldata, pagenum ]);
//
//   return {
//     type: 'PAGINATE',
//     // [當頁的資料, 總資料數, 現在在第幾頁]
//     payload: [ pagedata, ttldata, pagenum ]
//   }
//
// }
