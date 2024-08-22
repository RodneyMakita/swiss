import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/app/auth/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EditProfileProps {
  setIsEditing: (isEditing: boolean) => void;
  displayName: string;
  email: string;
  avatarUrl: string | null;
}

export const EditProfile: React.FC<EditProfileProps> = ({ setIsEditing, displayName, email, avatarUrl }) => {
  const { user } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [newEmail, setNewEmail] = useState(email || ''); 
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
    
      if (!newEmail && user.email) {
        setNewEmail(user.email);
      }
    }
  }, [user, newEmail]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewAvatar(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (user) {
      try {
        setUploading(true);

        let newAvatarUrl: string | null = avatarUrl;
        if (newAvatar) {
          const avatarRef = ref(storage, `avatars/${user.uid}/${newAvatar.name}`);
          await uploadBytes(avatarRef, newAvatar);
          newAvatarUrl = await getDownloadURL(avatarRef);
        }

        await setDoc(doc(db, 'users', user.uid), {
          displayName: newDisplayName,
          email: newEmail,
          avatarUrl: newAvatarUrl,
        }, { merge: true });

        await updateProfile(user, { displayName: newDisplayName, photoURL: newAvatarUrl });

        console.log('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setUploading(false);
      }
    } else {
      console.error('User not authenticated');
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} alt="User Avatar" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <Button variant="outline">
            <label className="cursor-pointer">
              Change Avatar
              <input type="file" onChange={handleAvatarChange} hidden />
            </label>
          </Button>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>
          <Button className="ml-auto" onClick={handleSubmit} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
      <Button variant="ghost" className="ml-auto mt-4" onClick={() => setIsEditing(false)}>
        Back
      </Button>
    </Card>
  );
};
