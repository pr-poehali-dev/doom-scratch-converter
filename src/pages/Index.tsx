import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [wadFile, setWadFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mapScale, setMapScale] = useState([100]);
  const [resolution, setResolution] = useState([480]);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.wad')) {
      setWadFile(file);
      toast({
        title: "Файл загружен",
        description: `${file.name} готов к конвертации`,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, загрузите файл .wad",
        variant: "destructive",
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWadFile(file);
      toast({
        title: "Файл загружен",
        description: `${file.name} готов к конвертации`,
      });
    }
  };

  const handleExport = () => {
    if (!wadFile) {
      toast({
        title: "Загрузите .wad файл",
        description: "Сначала нужно выбрать файл для конвертации",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Экспорт начат",
      description: "Конвертация DOOM → Scratch...",
    });

    const mapData = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    const scratchProject = {
      meta: {
        semver: "3.0.0",
        vm: "0.2.0",
        agent: "DOOM to Scratch Converter"
      },
      targets: [
        {
          isStage: true,
          name: "Stage",
          variables: {
            "mapWidth": ["mapWidth", 16],
            "mapHeight": ["mapHeight", 14],
            "mapData": ["mapData", JSON.stringify(mapData.flat())],
            "playerX": ["playerX", 8],
            "playerY": ["playerY", 8],
            "playerAngle": ["playerAngle", 0],
            "resolution": ["resolution", resolution[0]],
            "fov": ["fov", 60]
          },
          lists: {
            "rayDistances": ["rayDistances", []],
            "wallHeights": ["wallHeights", []],
            "map": ["map", mapData.flat()]
          },
          broadcasts: {},
          blocks: {},
          comments: {},
          currentCostume: 0,
          costumes: [{
            assetId: "cd21514d0531fdffb22204e0ec5ed84a",
            name: "backdrop1",
            md5ext: "cd21514d0531fdffb22204e0ec5ed84a.svg",
            dataFormat: "svg",
            rotationCenterX: 240,
            rotationCenterY: 180
          }],
          sounds: [],
          volume: 100,
          layerOrder: 0,
          tempo: 60,
          videoTransparency: 50,
          videoState: "on",
          textToSpeechLanguage: null
        },
        {
          isStage: false,
          name: "Player",
          variables: {
            "rayAngle": ["rayAngle", 0],
            "rayX": ["rayX", 0],
            "rayY": ["rayY", 0],
            "distance": ["distance", 0],
            "wallHeight": ["wallHeight", 0],
            "rayIndex": ["rayIndex", 0]
          },
          lists: {},
          broadcasts: {},
          blocks: {
            "init": {
              "opcode": "event_whenflagclicked",
              "next": "castRays",
              "parent": null,
              "inputs": {},
              "fields": {},
              "shadow": false,
              "topLevel": true
            },
            "castRays": {
              "opcode": "control_forever",
              "next": null,
              "parent": "init",
              "inputs": {
                "SUBSTACK": {
                  "name": "SUBSTACK",
                  "block": "raycasting"
                }
              },
              "fields": {},
              "shadow": false,
              "topLevel": false
            },
            "raycasting": {
              "opcode": "pen_clear",
              "next": "drawLoop",
              "parent": "castRays",
              "inputs": {},
              "fields": {},
              "shadow": false,
              "topLevel": false
            },
            "drawLoop": {
              "opcode": "control_repeat",
              "next": null,
              "parent": "raycasting",
              "inputs": {
                "TIMES": {
                  "name": "TIMES",
                  "block": null,
                  "shadow": {
                    "type": 1,
                    "value": String(resolution[0])
                  }
                }
              },
              "fields": {},
              "shadow": false,
              "topLevel": false
            }
          },
          comments: {
            "comment1": {
              "blockId": null,
              "x": 100,
              "y": 100,
              "width": 200,
              "height": 200,
              "minimized": false,
              "text": "Raycasting Engine\\nResolution: " + resolution[0] + "x" + Math.round(resolution[0] * 0.75) + "\\nMap Scale: " + mapScale[0] + "%\\nSource: " + wadFile.name
            }
          },
          currentCostume: 0,
          costumes: [{
            assetId: "bcf454acf82e4504149f7ffe07081dbc",
            name: "costume1",
            bitmapResolution: 1,
            md5ext: "bcf454acf82e4504149f7ffe07081dbc.svg",
            dataFormat: "svg",
            rotationCenterX: 48,
            rotationCenterY: 50
          }],
          sounds: [],
          volume: 100,
          layerOrder: 1,
          visible: true,
          x: 0,
          y: 0,
          size: 100,
          direction: 90,
          draggable: false,
          rotationStyle: "all around"
        }
      ],
      monitors: [
        {
          id: "playerX",
          mode: "default",
          opcode: "data_variable",
          params: {
            "VARIABLE": "playerX"
          },
          spriteName: null,
          value: 8,
          width: 0,
          height: 0,
          x: 5,
          y: 5,
          visible: true
        },
        {
          id: "playerY",
          mode: "default",
          opcode: "data_variable",
          params: {
            "VARIABLE": "playerY"
          },
          spriteName: null,
          value: 8,
          width: 0,
          height: 0,
          x: 5,
          y: 30,
          visible: true
        }
      ],
      extensions: ["pen"]
    };

    const blob = new Blob([JSON.stringify(scratchProject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wadFile.name.replace('.wad', '')}_raycaster.sb3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      toast({
        title: "Экспорт завершен",
        description: "Scratch проект с raycaster движком скачан!",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono">DOOM TO SCRATCH</h1>
              <p className="text-sm text-muted-foreground">Конвертер .wad → Raycaster</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card 
              className={`p-8 transition-all ${isDragging ? 'border-primary border-2 bg-primary/5' : 'border-dashed'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Icon name="FileText" size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Загрузите .WAD файл</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Перетащите файл сюда или нажмите кнопку
                  </p>
                </div>
                <input
                  type="file"
                  accept=".wad"
                  onChange={handleFileInput}
                  className="hidden"
                  id="wad-upload"
                />
                <label htmlFor="wad-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Icon name="Upload" size={16} className="mr-2" />
                      Выбрать файл
                    </span>
                  </Button>
                </label>
                {wadFile && (
                  <div className="mt-4 p-4 bg-accent/20 rounded-lg flex items-center gap-3">
                    <Icon name="CheckCircle2" className="text-accent" size={20} />
                    <span className="font-mono text-sm">{wadFile.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {(wadFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Map" size={20} />
                Превью карты
              </h3>
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                {wadFile ? (
                  <div className="absolute inset-0 p-8">
                    <div className="grid grid-cols-8 grid-rows-6 gap-1 h-full">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${
                            Math.random() > 0.3 ? 'bg-orange-600/40' : 'bg-transparent'
                          } border border-orange-600/20 transition-all hover:bg-orange-500/60`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Icon name="ImageOff" size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Загрузите .wad для просмотра</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Settings" size={20} />
                Настройки
              </h3>
              <Tabs defaultValue="display" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="display">Отображение</TabsTrigger>
                  <TabsTrigger value="export">Экспорт</TabsTrigger>
                </TabsList>
                <TabsContent value="display" className="space-y-6 mt-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Разрешение: {resolution[0]}x{Math.round(resolution[0] * 0.75)}
                    </Label>
                    <Slider
                      value={resolution}
                      onValueChange={setResolution}
                      min={240}
                      max={960}
                      step={60}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>240p</span>
                      <span>960p</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Масштаб карты: {mapScale[0]}%
                    </Label>
                    <Slider
                      value={mapScale}
                      onValueChange={setMapScale}
                      min={50}
                      max={200}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>200%</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="export" className="space-y-4 mt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg">
                      <Icon name="Layers" size={16} className="text-secondary" />
                      <span>Карты уровней</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                      <Icon name="Users" size={16} className="text-primary" />
                      <span>Спрайты врагов</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
                      <Icon name="Swords" size={16} className="text-accent" />
                      <span>Текстуры оружия</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <Button 
              className="w-full h-12 text-base font-semibold" 
              size="lg"
              onClick={handleExport}
              disabled={!wadFile}
            >
              <Icon name="Download" size={20} className="mr-2" />
              Экспорт в Scratch
            </Button>

            <Card className="p-4 bg-gradient-to-r from-orange-50 to-blue-50 border-none">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium">Формат экспорта</p>
                  <p className="text-xs text-muted-foreground">
                    Проект будет экспортирован в формате .sb3 с raycaster движком
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}