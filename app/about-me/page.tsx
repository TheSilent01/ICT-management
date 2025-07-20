"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function AboutMePage() {
  const vCard = `BEGIN:VCARD\nVERSION:3.0\nFN:Yassine El Aidous\nEMAIL:yassine.elaidous@ensam.ac.ma\nADR;TYPE=HOME:;;;Meknes;;;Morocco\nURL;TYPE=linkedin:https://www.linkedin.com/in/yassine-el-aidous-a4783525b\nURL;TYPE=github:https://github.com/Yassine-el-aidous\nEND:VCARD`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">About Me</h1>
          <p className="text-lg text-muted-foreground">
            A brief introduction to my background, skills, and the vision behind this project.
          </p>
        </div>

        {/* About Me Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Yassine El Aidous</span>
              <Badge variant="secondary">Engineering Student</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Background</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I'm a first-year engineering student at ENSAM Meknes (École Nationale Supérieure d'Arts et Métiers), 
                  passionate about technology and software development. Currently pursuing my engineering degree with 
                  a focus on industrial engineering and digital transformation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This ICT Defect Management System represents my commitment to applying theoretical knowledge to 
                  real-world problems, combining my academic learning with practical software development skills.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Academic Journey</h3>
                <p className="text-muted-foreground leading-relaxed">
                  At ENSAM Meknes, I'm developing a strong foundation in engineering principles while exploring 
                  the intersection of traditional engineering and modern technology. My coursework covers industrial 
                  processes, quality management, and digital systems - knowledge that directly influenced the 
                  development of this defect tracking application.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I believe in learning by doing, which is why I've dedicated time to building practical applications 
                  that solve real problems in industrial and technological contexts.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Project Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                This defect management system was developed as part of my internship experience, combining my 
                academic knowledge with industry best practices. The goal was to create a comprehensive solution 
                that addresses real challenges in quality control and defect tracking within ICT environments.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The system incorporates modern web technologies, user-centric design, and automated workflows 
                to streamline the defect management process. It reflects my commitment to creating tools that 
                are both technically sound and practically useful.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support & Connect */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Connect</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Coffee className="h-10 w-10 text-primary" />
              <h3 className="text-lg font-medium">Support My Work</h3>
              <p className="text-muted-foreground text-center">If you find this project useful, consider supporting my work.</p>
              <a href="https://coff.ee/elaidousyaz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                Buy Me a Coffee
              </a>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3 p-4">
              <h3 className="text-lg font-medium">Scan to Connect</h3>
              <QRCodeSVG 
                value={vCard}
                size={160}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={true}
              />
              <p className="text-sm text-center text-muted-foreground">Scan this code to save my contact details.</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
