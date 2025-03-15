import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { Bs1Square, Bs2Square } from "react-icons/bs";

import { massfazCreate } from '../../redux/actions';

import { Placemark, YMapsApi } from 'react-yandex-maps';

import { CLINCH, BadCODE } from './../MapConst';

let FAZASIST = -1;
let FAZA = -1;
let nomInMassfaz = -1;

const GsDoPlacemarkDo = (props: {
  ymaps: YMapsApi | null;
  coordinate: any;
  idx: number;
  massMem: Array<number>;
  OnPlacemarkClickPoint: Function;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const DEMO = datestat.demo;
  const typeVert = datestat.typeVert;
  const dispatch = useDispatch();
  //===========================================================
  let id = props.idx;
  let mapp = map.tflight[id].tlsost.num.toString();
  let mappp = map.tflight[id];
  let pA = -1;
  let pB = -1;
  let pC = -1;
  let nomSvg = -1;
  let lengMem = props.massMem.length;

  let statusVertex = mappp.tlsost.num;
  let clinch = CLINCH.indexOf(statusVertex) < 0 ? false : true;
  let badCode = BadCODE.indexOf(statusVertex) < 0 ? false : true;

  if (lengMem >= 1) {
    pA = props.massMem[0];
    pB = props.massMem[lengMem - 1];
    if (datestat.toDoMode) pC = props.massMem.indexOf(props.idx);
  }

  let fazaImg: null | string = null;
  FAZASIST = FAZA = -1;
  nomInMassfaz = -1;
  if (pC >= 0) {
    let idv = mappp.idevice;
    for (let i = 0; i < massfaz.length; i++) {
      if (idv === massfaz[i].idevice) {
        FAZASIST = massfaz[i].fazaSist;
        FAZA = massfaz[i].faza;
        nomInMassfaz = i;
        if (FAZASIST === 11 || FAZASIST === 15) {
          nomSvg = 12; // ОС
          pC = -1;
        } else {
          if (FAZASIST === 10 || FAZASIST === 14) {
            nomSvg = 7; // ЖМ
            pC = -1;
          } else {
            if (FAZASIST > 0 && FAZASIST < 9 && massfaz[i].img) {
              if (FAZASIST <= massfaz[i].img.length)
                //fazaImg = massfaz[i].img[FAZASIST - 1];
                fazaImg = massfaz[i].img[FAZA - 1]; // костыль

              massfaz[i].fazaSistOld = FAZASIST;
              dispatch(massfazCreate(massfaz));
            }
          }
        }
      }
    }
  }

  if (mappp.ID === 61)
    console.log('massfaz:', lengMem, typeVert, fazaImg === null, FAZASIST, massfaz);

  const Hoster = React.useCallback(() => {
    let nomInRoute = props.massMem.indexOf(id);
    let illum = datestat.create && nomInRoute >= 0 ? true : false;

    let hostt =
      window.location.origin.slice(0, 22) === 'https://localhost:3000'
        ? 'https://localhost:3000/'
        : './';

    let host = !illum ? hostt + '18.svg' : hostt + '4.svg';
    if (!debug) {
      let mpp = illum ? 4 : mapp;
      if (nomSvg > 0) mpp = nomSvg.toString();
      if (DEMO) mpp = '1';
      host = window.location.origin + '/free/img/trafficLights/' + mpp + '.svg';
    } else if (DEMO) host = hostt + '1.svg';

    if (typeVert && pC >= 0 && FAZASIST > 0 && FAZASIST !== 9 && statusVertex !== 1) {
      // картинка с номером фазы
      let hostt =
        window.location.origin.slice(0, 22) === 'https://localhost:3000'
          ? 'https://localhost:3000/phases/'
          : './phases/';
      host = debug ? hostt + FAZASIST + '.svg' : '/file/static/img/buttons/' + FAZASIST + '.svg';
      //   hostt + FAZA + ".svg"
      // : "/file/static/img/buttons/" + FAZA + ".svg"; // костыль
    }

    return host;
  }, [mapp, nomSvg, debug, datestat.create, props.massMem, id, DEMO, pC, typeVert, statusVertex]);

  const createChipsLayout = React.useCallback(
    (calcFunc: Function, currnum: number, rotateDeg?: number) => {
      const Chips = props.ymaps?.templateLayoutFactory.createClass(
        '<div class="placemark"  ' +
          `style="background-image:url(${Hoster()}); ` +
          `background-size: 100%; transform: rotate(${rotateDeg ?? 0}deg);\n"></div>`,
        {
          build: function () {
            Chips.superclass.build.call(this);
            const map = this.getData().geoObject.getMap();
            if (!this.inited) {
              this.inited = true;
              // Получим текущий уровень зума.
              let zoom = map.getZoom();
              // Подпишемся на событие изменения области просмотра карты.
              map.events.add(
                'boundschange',
                function () {
                  // Запустим перестраивание макета при изменении уровня зума.
                  const currentZoom = map.getZoom();
                  if (currentZoom !== zoom) {
                    zoom = currentZoom;
                    //@ts-ignore
                    this.rebuild();
                  }
                },
                this,
              );
            }
            const options = this.getData().options,
              // Получим размер метки в зависимости от уровня зума.
              size = calcFunc(map.getZoom()) + 6,
              element = this.getParentElement().getElementsByClassName('placemark')[0],
              // По умолчанию при задании своего HTML макета фигура активной области не задается,
              // и её нужно задать самостоятельно.
              // Создадим фигуру активной области "Круг".
              circleShape = {
                type: 'Circle',
                coordinates: [0, 0],
                radius: size / 2,
              };
            // Зададим высоту и ширину метки.
            element.style.width = element.style.height = size + 'px';
            // Зададим смещение.
            //element.style.marginLeft = element.style.marginTop =
            //-size / 2 + "px";
            element.style.marginLeft = -size / 2.0 + 'px';
            element.style.marginTop = -size / 1.97 + 'px';
            // Зададим фигуру активной области.
            options.set('shape', circleShape);
          },
        },
      );
      return Chips;
    },
    [Hoster, props.ymaps?.templateLayoutFactory],
  );

  const calculate = function (zoom: number): number {
    switch (zoom) {
      case 14:
        return 30;
      case 15:
        return 35;
      case 16:
        return 40;
      case 17:
        return 45;
      case 18:
        return 50;
      case 19:
        return 55;
      default:
        return 25;
    }
  };

  const GetPointOptions1 = React.useCallback(
    (hoster: any) => {
      let Hoster = hoster;
      let imger: any = '';
      let FZSIST = FAZASIST;

      if (FAZASIST === 9 || !FAZASIST) {
        FZSIST = massfaz[nomInMassfaz].fazaSistOld;
        Hoster = massfaz[nomInMassfaz].img[massfaz[nomInMassfaz].fazaSistOld - 1];
      }
      let iconSize = Hoster ? 50 : 25;
      let iconOffset = Hoster ? -25 : -12.5;
      if (Hoster) imger = 'data:image/png;base64,' + Hoster;
      if (!Hoster) {
        let hostt =
          window.location.origin.slice(0, 22) === 'https://localhost:3000'
            ? 'https://localhost:3000/'
            : './';
        if (FZSIST > 0) {
          imger = debug
            ? hostt + FZSIST + '.jpg'
            : window.location.origin + '/free/img/' + FZSIST + '.jpg';
        }
      }

      return {
        // данный тип макета
        iconLayout: 'default#image',
        // изображение иконки метки
        iconImageHref: imger,
        // размеры метки
        iconImageSize: [iconSize, iconSize],
        // её "ножки" (точки привязки)
        iconImageOffset: [iconOffset, iconOffset],
      };
    },
    [debug, massfaz],
  );

  const GetPointData = (
    index: number,
    pointAaIndex: number,
    pointBbIndex: number,
    massdk: any,
    map: any,
    massMem: any,
  ) => {
    let cont1 = massdk[index].nameCoordinates + '<br/>';
    let cont3 = map.tflight[index].tlsost.description + '<br/>';
    let cont2 = '[' + massdk[index].ID + ', ' + map.tflight[index].idevice + ']';
    let textBalloon = '';
    let nomInRoute = massMem.indexOf(index);
    if (nomInRoute > 0) textBalloon = 'Промежуточная точка маршрута №' + (nomInRoute + 1);
    if (index === pointBbIndex) textBalloon = 'Конец маршрута';
    if (index === pointAaIndex) textBalloon = 'Начало маршрута';

    return {
      hintContent: cont1 + cont3 + cont2 + '<br/>' + textBalloon,
    };
  };

  const MemoPlacemarkDo = React.useMemo(
    () => (
      <Placemark
        key={id}
        geometry={props.coordinate}
        properties={GetPointData(id, pA, pB, massdk, map, props.massMem)}
        options={
          pC < 0 ||
          FAZASIST <= 0 ||
          (FAZASIST === 9 && massfaz[nomInMassfaz].fazaSistOld < 0) ||
          (lengMem > 2 && typeVert === 2) ||
          (lengMem > 2 && typeVert === 1 && !fazaImg) ||
          clinch ||
          badCode ||
          statusVertex === 1
            ? //||
              //(DEMO && datestat.toDoMode)
              DEMO && datestat.toDoMode && fazaImg
              ? GetPointOptions1(fazaImg)
              : { iconLayout: createChipsLayout(calculate, mappp.tlsost.num) }
            : GetPointOptions1(fazaImg)
        }
        modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
        onClick={() => props.OnPlacemarkClickPoint(id)}
      />
    ),
    [
      createChipsLayout,
      id,
      mappp.tlsost.num,
      pA,
      pB,
      massdk,
      map,
      fazaImg,
      pC,
      props,
      massfaz,
      GetPointOptions1,
      lengMem,
      typeVert,
      clinch,
      badCode,
      statusVertex,
      DEMO,
      datestat.toDoMode,
    ],
  );
  return MemoPlacemarkDo;
};

export default GsDoPlacemarkDo;
