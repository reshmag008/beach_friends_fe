import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Phone, MapPin, Shield, Crosshair, Target, Save, X, Crop ,MessageCircle,Download,Upload,Copy} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePlayer } from '@/context/PlayerContext';
import { Player, playerRoles, battingStyles, bowlingStyles, sizeList } from '@/types/player';
import { toast } from 'sonner';
import ImageCropper from './ImageCropper';
import PlayerService from '@/service/PlayerService';
import {playerStatus} from "../constants";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PlayerFormProps {
  editPlayer?: Player;
  onCancel?: () => void;
}

const PlayerForm = ({ editPlayer, onCancel }: PlayerFormProps) => {
  const navigate = useNavigate();

  const paymentInputRef = useRef<HTMLInputElement>(null);

const [paymentImage, setPaymentImage] = useState<File | null>(null);
const [paymentPreview, setPaymentPreview] = useState("");


  const { addPlayer, updatePlayer } = usePlayer();
  const fileInputRef = useRef<HTMLInputElement>(null);
   const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullname: '',
    contact_no: '',
    location: '',
    player_role: '',
    batting_style: '',
    bowling_style: '',
    profile_image: '',
    jersey_name : "",
    jersey_no:'',
    jersey_size : '',
    whatsapp_no : '',
    status: 1,
    bid_amount : 0,
    payment_screenshot : '',
    jersey_sleeve:''
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] =  useState<File|null>(null);

  useEffect(() => {
    if (editPlayer) {
      setFormData({
        fullname: editPlayer.fullname,
        contact_no: editPlayer.contact_no,
        location: editPlayer.location,
        player_role: editPlayer.player_role,
        batting_style: editPlayer.batting_style,
        bowling_style: editPlayer.bowling_style,
        profile_image: editPlayer.profile_image,
        jersey_name: editPlayer.jersey_name,
        jersey_no: editPlayer.jersey_no,
        jersey_size: editPlayer.jersey_size,
        jersey_sleeve:editPlayer.jersey_sleeve,
        whatsapp_no: editPlayer.whatsapp_no,
        status : editPlayer.status,
        bid_amount : editPlayer.bid_amount,
        payment_screenshot : editPlayer.payment_screenshot
      });
      setImagePreview(`https://storage.googleapis.com/rajas_pl/${editPlayer.profile_image}`);
    }
  }, [editPlayer]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedImage(file);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageToCrop(result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
      
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setImagePreview(croppedImage);
    const file = dataURLtoFile(croppedImage);
      setSelectedImage(file);
    setShowCropper(false);
    setImageToCrop('');
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReCrop = () => {
    if (imagePreview) {
      setImageToCrop(imagePreview);
      const file = dataURLtoFile(imagePreview);
      setSelectedImage(file);
      setShowCropper(true);
    }
  };

    const dataURLtoFile = (dataUrl: string) => {
      let fileName = formData.fullname + "_" + formData.contact_no + ".jpeg";
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], fileName, { type: mime });
    };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      toast.error('Profile Image is required');
      return;
    }

    if (!formData.fullname.trim()) {
      toast.error('Player name is required');
      return;
    }
    if (!formData.contact_no.trim()) {
      toast.error('Contact number is required');
      return;
    }

     if (!formData.whatsapp_no.trim()) {
      toast.error('Whatsapp Number is required');
      return;
    }

    if (!formData.location) {
      toast.error('Location is required');
      return;
    }
 
    if (!formData.player_role) {
      toast.error('Player role is required');
      return;
    }

    if (!formData.batting_style) {
      toast.error('Batting Style is required');
      return;
    }

    if (!formData.bowling_style) {
      toast.error('Bowling Style is required');
      return;
    }

   
    // if (!formData.jersey_size) {
    //   toast.error('Jersey Size is required');
    //   return;
    // }

    
    // if (!formData.jersey_sleeve) {
    //   toast.error('Jersey Sleeve is required');
    //   return;
    // }

   

    
    

    if (editPlayer) {
      updatePlayer(editPlayer.id, formData);
      toast.success('Player updated successfully!');
      onCancel?.();
    } else {
      savePlayer();
    }
  };


  const savePlayer =()=>{
    setIsLoading(true);
    formData.profile_image = formData.fullname + "_" + formData.contact_no + ".jpeg";
    formData.status = playerStatus.pending;
    formData.jersey_sleeve = 'H';
    console.log("formData== ",formData)
    PlayerService().addPlayer(formData).then((response:any)=>{
        console.log("response== ", response);
        if(response.data){
          toast.success('Player Registered Succesfully')
           addPlayer(formData);
             navigate('/players');
          playerImageUpload(response.data.id);
          playerpaymentScreenshotUpload(response.data.id)
        }else{
          toast.error('Registration Failed')
        }
        
      }).catch((err:any)=>{
        console.log("err========= ", err)
        if(err.response && err.response.data && err.response.data.name && err.response.data.name === "SequelizeUniqueConstraintError" ){
          toast.error('Player Already Exists')
        }else{
          toast.error('Unable to process your request. Pls try again later')
        }
        setIsLoading(false);
      })
  }


  const playerImageUpload = async (playerId:any) => {
    try{
    const formFileData = new FormData()
    if(selectedImage){
      formFileData.append('file_name', formData.fullname + "_" + formData.contact_no + ".jpeg",)
      formFileData.append('player_id', playerId)
      formFileData.append('file', selectedImage)
    await PlayerService().PlayerImageGoogleStorageCloudUpload(formFileData);
    setIsLoading(false);
  };
}catch(err){
  console.log("Error while image upload")
  toast.error('Image upload failed. Please contact your admin')
  setIsLoading(false);
}
  }

    const playerpaymentScreenshotUpload = async (playerId:any) => {
    try{
    const formFileData = new FormData()
    if(paymentImage){
      formFileData.append('file_name', 'Pay_ScrShot_'+formData.fullname + "_" + formData.contact_no + ".jpeg",)
      formFileData.append('screenshot', 'Pay_ScrShot_'+formData.fullname + "_" + formData.contact_no + ".jpeg",)
      formFileData.append('player_id', playerId)
      formFileData.append('file', paymentImage)
    await PlayerService().PlayerImageGoogleStorageCloudUpload(formFileData);
    setIsLoading(false);
  };
}catch(err){
  console.log("Error while screenshot upload")
  toast.error('Payment Screenshot upload failed. Please contact your admin')
  setIsLoading(false);
}
  }



  const handlePaymentUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setPaymentImage(file);
  setPaymentPreview(URL.createObjectURL(file));
};




  const inputClasses = "h-11 sm:h-12 text-sm sm:text-base border-2 border-border focus:border-primary transition-colors bg-card";

  return (
    <>
      {showCropper && imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 animate-fade-in">
        {/* Image Upload */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-xl bg-muted border-4 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group overflow-hidden"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Player"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 sm:gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="text-xs font-medium text-center px-2">Upload Photo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Click to upload player photo</p>
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReCrop}
                className="text-xs border-2"
              >
                <Crop className="w-3 h-3 mr-1" />
                Re-crop Image
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Name */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              Player Name *
            </Label>
            <Input
              id="name"
              value={formData.fullname}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullname: e.target.value }))}
              placeholder="Enter player name"
              className={inputClasses}
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Enter your location"
              className={inputClasses}
            />
          </div>

  {/* Contact Number */}
  <div className="space-y-1.5 sm:space-y-2">
    <Label
      htmlFor="contact"
      className="flex items-center gap-2 text-xs sm:text-sm font-semibold"
    >
      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
      Contact Number *
    </Label>

    
     <PhoneInput
      country="ae"
      enableSearch={true}
      searchPlaceholder="Search country..."
      value={formData.contact_no}
      onChange={(phone) =>
        setFormData((prev) => ({
          ...prev,
          contact_no: phone,
        }))
      }
      inputProps={{
        id: "contact_no",
        name: "contact_no",
        required: true,
      }}
      containerClass="!w-full"
      inputClass="
        !w-full
        !h-10
        sm:!h-11
        !rounded-md
        !border
        !border-input
        !bg-background
        !text-sm
      "
      buttonClass="
        !h-10
        sm:!h-11
        !rounded-l-md
        !border-input
        !bg-background
      "
      dropdownClass="!z-50"
    />


  </div>

  {/* WhatsApp Number */}
  <div className="space-y-1.5 sm:space-y-2">
    <Label
      htmlFor="whatsapp_no"
      className="flex items-center gap-2 text-xs sm:text-sm font-semibold"
    >
      <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
      WhatsApp Number *
    </Label>

    <PhoneInput
      country="ae"
      enableSearch={true}
      searchPlaceholder="Search country..."
      value={formData.whatsapp_no}
      onChange={(phone) =>
        setFormData((prev) => ({
          ...prev,
          whatsapp_no: phone,
        }))
      }
      inputProps={{
        id: "whatsapp_no",
        name: "whatsapp_no",
        required: true,
      }}
      containerClass="!w-full"
      inputClass="
        !w-full
        !h-10
        sm:!h-11
        !rounded-md
        !border
        !border-input
        !bg-background
        !text-sm
      "
      buttonClass="
        !h-10
        sm:!h-11
        !rounded-l-md
        !border-input
        !bg-background
      "
      dropdownClass="!z-50"
    />
  </div>

          

          {/* Player Role */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              Player Role *
            </Label>
            <Select
              value={formData.player_role}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, player_role: value }))}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-2 border-border z-50">
                {playerRoles.map((role) => (
                  <SelectItem key={role} value={role} className="cursor-pointer hover:bg-muted">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Batting Style */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              Batting Style
            </Label>
            <Select
              value={formData.batting_style}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, batting_style: value }))}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Select batting style" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-2 border-border z-50">
                {battingStyles.map((style) => (
                  <SelectItem key={style} value={style} className="cursor-pointer hover:bg-muted">
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bowling Style */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              Bowling Style
            </Label>
            <Select
              value={formData.bowling_style}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, bowling_style: value }))}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Select bowling style" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-2 border-border z-50">
                {bowlingStyles.map((style) => (
                  <SelectItem key={style} value={style} className="cursor-pointer hover:bg-muted">
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jersey Name */}
          {/* <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="contact" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              Jersey Name
            </Label>
            <Input
              id="jersey_name"
              value={formData.jersey_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, jersey_name: e.target.value }))}
              placeholder="Enter Jersey Name"
              className={inputClasses}
            />
          </div> */}

          {/* Jersey No */}
          {/* <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="contact" className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              Jersey Number
            </Label>
            <Input
              id="jersey_no"
              value={formData.jersey_no}
              onChange={(e) => setFormData((prev) => ({ ...prev, jersey_no: e.target.value }))}
              placeholder="Enter Jersey No"
              className={inputClasses}
            />
          </div> */}

          {/* Jersey Size */}
          {/* <div className="space-y-1.5 sm:space-y-2">
            <Label className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              Jersey Size*
            </Label>
            <Select
              value={formData.jersey_size}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, jersey_size: value }))}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Select Jersey Size" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-2 border-border z-50">
                {sizeList.map((style) => (
                  <SelectItem key={style} value={style} className="cursor-pointer hover:bg-muted">
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}


{/* <div className="space-y-2">
  <Label>Jersey Sleeve</Label>

  <RadioGroup
    value={formData.jersey_sleeve}
    onValueChange={(value) =>
      setFormData((prev) => ({
        ...prev,
        jersey_sleeve: value,
      }))
    }
    className="flex gap-6"
  >
    <div className="flex items-center gap-2">
      <RadioGroupItem value="H" id="sleeve-half" />
      <Label htmlFor="sleeve-half">H (Half Sleeve)</Label>
    </div>

    <div className="flex items-center gap-2">
      <RadioGroupItem value="F" id="sleeve-full" />
      <Label htmlFor="sleeve-full">F (Full Sleeve)</Label>
    </div>
  </RadioGroup>
</div> */}





        </div>

       {/* <div className="flex flex-col items-center justify-center gap-4 p-5 rounded-xl border border-border bg-card shadow-sm">
  <h3 className="text-lg font-semibold">
    Payment Information
  </h3>

  <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-5 w-full">
    <span className="text-sm text-muted-foreground">
      Payment Number
    </span>

    <div className="flex items-center gap-3">
      <span className="text-2xl font-bold tracking-wider">
        9302 0909 (Saneej)
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => navigator.clipboard.writeText("93020909")}
        aria-label="Copy payment number"
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  </div>

  <p className="text-xs text-center text-muted-foreground">
    Use this payment number to complete your registration payment.
  </p>
</div> */}



{/* <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card shadow-sm">
  <h3 className="text-lg font-semibold text-center">
    Contact Information
  </h3>

  <div className="flex flex-col gap-3">
    {[
      { name: "Saneej", phone: "9302 0909" },
      { name: "Najeem", phone: "9045 6786" },
      { name: "Irshad", phone: "9641 5605" },
    ].map((contact) => (
      <div
        key={contact.name}
        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 p-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            {contact.name.charAt(0)}
          </div>

          <div className="min-w-0">
            <p className="font-semibold">{contact.name}</p>
            <p className="text-sm text-muted-foreground">
              {contact.phone}
            </p>
          </div>
        </div>

        <a
          href={`tel:${contact.phone.replace(/\s/g, "")}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-80"
          aria-label={`Call ${contact.name}`}
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>
    ))}
  </div>

  <p className="text-xs text-center text-muted-foreground">
    Contact any of the above persons for registration or payment assistance.
  </p>
</div> */}



  


        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
          {!isLoading ? (
          <Button
            type="submit"
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-semibold gradient-pitch hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {editPlayer ? 'Update Player' : 'Register Player'}
          </Button>
          ):(
            <div className="flex justify-center ">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-11 sm:h-12 px-6 border-2"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Cancel
            </Button>
          )}
        </div>

        

{/* </div> */}


      </form>


    </>
  );
};

export default PlayerForm;